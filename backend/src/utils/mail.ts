import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Base Products" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verification Code - Base Products',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Email Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <hr />
          <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log('OTP Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};
