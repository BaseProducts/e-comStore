import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-jwt-secret-key'
    );

    (req as any).user = decoded;

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired session block.' });
    }

    // Attach user to request object
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    console.error('Auth check error:', err.message);
    res.status(401).json({ message: 'Internal server error while verifying session.' });
  }
};
