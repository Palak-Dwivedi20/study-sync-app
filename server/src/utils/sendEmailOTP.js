// utils/sendEmailOTP.js
import nodemailer from "nodemailer";

export const sendEmailOTP = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: `"StudySync" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: `
            <h2>Verify your account</h2>
            <p>Your OTP is: <strong>${text}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
        `
    });
};
