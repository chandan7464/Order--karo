import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer . createTransport({
    service:"Gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
})

export const sendMail = async (to, otp) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: to,
            subject: "Reset Your Password",  // ✅ Subject → subject (lowercase)
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in <b>5 minutes</b>.</p>`,  // ✅ wrapped in backticks + ${otp}
        });
    } catch (error) {
        console.error("Mail error:", error);  // ✅ added error logging
    }
}