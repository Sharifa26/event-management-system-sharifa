import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendMail = async ({ to, subject, text, html }) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html
    };

    return transporter.sendMail(mailOptions);
}

export default sendMail;
