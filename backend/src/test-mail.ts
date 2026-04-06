import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true,
});

export const sendOTP = async (email: string, otp: string): Promise<void> => {
    try {
        console.log("Sending OTP to:", email)
        await transporter.verify();
        console.log("SMTP connection verified");

        const info = await transporter.sendMail({
            from: `"Your App" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            html: `<h2>Your OTP is: ${otp}</h2>`,
        })

        console.log("Email sent:", info.messageId)

    } catch (error) {
        console.error("EMAIL ERROR:", error)
        throw error
    }
}