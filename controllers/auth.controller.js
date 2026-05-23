
import crypto from 'crypto';
import userModel from '../models/user.models.js';
import jwt from 'jsonwebtoken';
import config from '../src/config/config.js';
import sessionModel from '../models/sessions.model.js';
import {sendEmail} from '../src/services/email.services.js';
import {generateOtp, getotphtml} from '../src/utils/utils.js';
import otpModel from '../models/otp.model.js';


export async function register(req, res) {
    const {username, email, password}= req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    });
    if(isAlreadyRegistered){
        return res.status(400).json({
            success: false,
            message: "Username or email already exists"
        });
    }    
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');      

    const newUser= await userModel.create({
        username,
        email,
        password: hashedPassword

    });

    const otp = generateOtp();
    const html = getotphtml(otp);

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await otpModel.create({
        email,
        userId: newUser._id,
        otpHash
    })
    await sendEmail(email, "Verify your email", `Your OTP is ${otp}`, html);


    res.status(201).json({
        message: "user registered successfully",
        user: {
                username: newUser.username,
                email: newUser.email,
                verified: newUser.verified  
        }

    })
}

export async function login(req, res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"    
        });
    } 
    if(!user.verified){
        return res.status(400).json({
            message: "Please verify your email before logging in"    
        });
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if(user.password !== hashedPassword){
        return res.status(400).json({
            message: "Invalid email or password"    
        });
    }
    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: '7d'     
    })  
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.create({
        userId: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: '15m'     
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
     }  
    )

    res.status(200).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
        },
     accessToken
    });
        }

export async function getMe(req, res) {
    const token= req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);  

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user,
        message: "User details fetched successfully"
    });
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if(!session){
        return res.status(400).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: '15m'     
    })
    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: '7d'     
    })
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
     }  
    )
    res.status(200).json({
        success: true,
        accessToken,
        message: "Access token refreshed successfully"
    });
}

export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if(!session){
        return res.status(400).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
    session.revoked = true;
    await session.save();
    
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}

export async function logoutAll(req, res) {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    
    await sessionModel.updateMany({
        userId: decoded.id,
        revoked: false
    }, {
        revoked: true
    });
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: "Logged out from all sessions successfully"
    });
}

export async function verifyEmail(req, res) {
    const {email, otp} = req.body;
    
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    
    const otpRecord = await otpModel.findOne({
        email,
        otpHash
    });
    if(!otpRecord){
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }
    const user = await userModel.findByIdAndUpdate(otpRecord.userId, {
        verified: true
    }, {
        new: true
    });
    await otpModel.deleteMany({
    email
});

return res.status(200).json({   
    success: true,
    message: "Email verified successfully"
});


}