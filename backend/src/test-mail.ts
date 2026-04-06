import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST || 'smtp.gmail.com',
port: parseInt(process.env.SMTP_PORT || '587'),
secure: false,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS,
},
connectionTimeout: 5000, // ✅ prevent long hangs
greetingTimeout: 5000,
});

// ❌ DO NOT export async blocking function
// ✅ make it non-blocking
export const sendOTP = (email: string, otp: string): void => {
console.log("Sending OTP to:", email);


transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: ${otp}</h2>`,
})
.then(info => {
    console.log("Email sent:", info.messageId);
})
.catch(error => {
    console.error("EMAIL ERROR (non-blocking):", error.message);
});


};
