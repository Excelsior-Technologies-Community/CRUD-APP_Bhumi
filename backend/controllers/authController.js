
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';
import { generateTempPassword, generateOtp } from '../utils/generateCode.js';

const OTP_EXPIRY_MINUTES = 10;

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const tempPassword = generateTempPassword();

    const user = await User.create({ name, email, password: tempPassword });

    await sendEmail({
      to: user.email,
      subject: 'Your temporary password',
      text: `Hi ${user.name},\n\nYour account has been created. Use this temporary password to log in:\n\n${tempPassword}\n\nYou can change it after logging in from the Change Password page.\n`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. A temporary password has been sent to your email.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ success: false, message: firstError });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both old and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isOldPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect',
      });
    }

    user.password = newPassword; // pre-save hook hashes this automatically
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ success: false, message: firstError });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
      user.otpVerified = false;
      await user.save();

      await sendEmail({
        to: user.email,
        subject: 'Your password reset OTP',
        text: `Hi ${user.name},\n\nYour OTP to reset your password is: ${otp}\n\nThis code expires in ${OTP_EXPIRY_MINUTES} minutes.\n`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+otp +otpExpiry'
    );

    const invalidMessage = 'Invalid or expired OTP';

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: invalidMessage });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: invalidMessage });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: invalidMessage });
    }

    user.otpVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+otp +otpExpiry +otpVerified'
    );

    const invalidMessage = 'Invalid or expired OTP. Please request a new one.';

    if (!user || !user.otp || !user.otpExpiry || !user.otpVerified) {
      return res.status(400).json({ success: false, message: invalidMessage });
    }

    if (user.otpExpiry < new Date() || user.otp !== otp) {
      return res.status(400).json({ success: false, message: invalidMessage });
    }

    user.password = newPassword; // pre-save hook hashes this
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpVerified = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ success: false, message: firstError });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
