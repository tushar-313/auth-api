import {Router} from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

/*
    @route POST /api/auth/register
*/

router.post('/register', authController.register);

/*login user
    @route POST /api/auth/login
*/
router.post('/login', authController.login);

/* get user details
    @route GET /api/auth/getme
*/
router.get('/getme', authController.getMe);

/* refresh access token
    @route POST /api/auth/refresh
*/
router.get('/refresh', authController.refreshToken);

/* logout user
    @route POST /api/auth/logout
*/
router.get('/logout', authController.logout);

/*logout all sessions
    @route POST /api/auth/logoutall
*/
router.get('/logoutall', authController.logoutAll);

/*verify email
    @route POST /api/auth/verify-email
*/
router.post('/verify-email', authController.verifyEmail);

export default router;