import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    const fullName = req.body.fullName?.trim();

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password, and full name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists. Please sign in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      role: 'user',
    });

    const plainUser = user.get({ plain: true });

    const token = jwt.sign(
      { id: plainUser.id, email: plainUser.email, role: plainUser.role },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully!',
      token,
      user: {
        id: plainUser.id,
        email: plainUser.email,
        fullName: plainUser.fullName,
        role: plainUser.role,
      },
    });
  } catch (error: any) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const plainUser = user.get({ plain: true });

    const token = jwt.sign(
      { id: plainUser.id, email: plainUser.email, role: plainUser.role },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful!',
      token,
      user: {
        id: plainUser.id,
        email: plainUser.email,
        fullName: plainUser.fullName,
        role: plainUser.role,
      },
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};
