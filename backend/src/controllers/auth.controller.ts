import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOTP } from '../utils/mail.js';
import { Op } from 'sequelize';

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const mode = req.body.mode;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // If login mode, ensure user exists
    if (mode === 'login') {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'No account found with this email. Please sign up first.'
        });
      }
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP
    await Otp.destroy({ where: { email } });
    await Otp.create({
      email,
      otp: otpCode,
      expiresAt,
    });

    // ✅ SEND RESPONSE FIRST (CRITICAL FIX)
    res.status(200).json({
      status: 'otp_required',
      message: 'OTP generated successfully.',
      email,
    });

    // ✅ NON-BLOCKING EMAIL (won’t crash app)
    sendOTP(email, otpCode);

    // ✅ FALLBACK FOR NOW (VERY IMPORTANT)
    console.log("OTP for", email, "is:", otpCode);

  } catch (error: any) {
    console.error('OTP Request Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const otp = req.body.otp?.toString().trim();
    const fullName = req.body.fullName;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find valid OTP
    const storedOtp = await Otp.findOne({
      where: {
        email,
        otp,
        expiresAt: { [Op.gt]: new Date() }, // Not expired
      },
    });

    if (!storedOtp) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified, consume it
    await Otp.destroy({ where: { email } });

    // Find or create user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        fullName: fullName || email.split('@')[0],
        role: 'user',
      });
    }

    // Generate local JWT
    const plainUser = user.get({ plain: true });

    const token = jwt.sign(
      {
        id: plainUser.id,
        email: plainUser.email,
        role: plainUser.role,
      },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      {
        expiresIn: '7d',
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Authentication successful!',
      token,
      user: {
        id: plainUser.id,
        email: plainUser.email,
        fullName: plainUser.fullName,
        role: plainUser.role,
      },
    });
  } catch (error: any) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: error.message });
  }
};
