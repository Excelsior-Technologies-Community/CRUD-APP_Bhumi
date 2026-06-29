import express from 'express';
import {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/change-password', protect, changePassword);

router.post('/forgot-password', forgotPassword);

router.post('/verify-otp', verifyOtp);

router.post('/reset-password', resetPassword);

export default router;
