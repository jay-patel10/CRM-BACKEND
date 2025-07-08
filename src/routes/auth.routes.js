import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  verifyOtp,
  forgotPassword,
  verifyForgotPasswordToken,
  logoutUser
} from '../controllers/index.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/verify-forgot-password', verifyForgotPasswordToken);
router.post('/logout', logoutUser);

export default router;
