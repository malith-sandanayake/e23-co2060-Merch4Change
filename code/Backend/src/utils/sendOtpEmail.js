import nodemailer from "nodemailer";

// otp sender mail
const user = process.env.EMAIL_USER 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (toEmail, otp) => {
    await transporter.sendMail({
        from: `"Merch4Change" <${user}>`,
        to: toEmail,
        subject: 'Your Verification Code',
        html: `
      <h2>Email Verification</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code expires in ${process.env.OTP_EXPIRY_MINUTES} minutes.</p>
    `,
    })
} 

export default sendOtpEmail;