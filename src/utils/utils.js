export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getotphtml(otp) {
    return `<!Doctype html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>OTP Verification</title>
    </head>
    <body>
        <h2>Your OTP for verification is: ${otp}</h2>
        <p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
    </body>
    </html>`;
}

