import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";

const otpStore = {};

// transporter lai function bhitra banauxa taaki dotenv already load bhaisakos
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const [users] = await connectDB.execute("SELECT * FROM register WHERE email = ?", [email]);
  if (users.length === 0)
    return res.status(404).json({ success: false, message: "No account found with this email" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 1 * 60 * 1000 };

  try {
    await getTransporter().sendMail({
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `<p>Your OTP is: <b style="font-size:20px">${otp}</b></p><p>Valid for <b>1 minute</b>.</p>`,
    });
  } catch (mailErr) {
    console.error("Mail error:", mailErr.message);
    return res.status(500).json({ success: false, message: "Failed to send email: " + mailErr.message });
  }

  res.status(200).json({ success: true, message: "OTP sent to your email" });
};

export const verifyOtpAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ success: false, message: "All fields required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ success: false, message: "OTP not requested" });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }
  if (record.otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await connectDB.execute("UPDATE register SET password = ? WHERE email = ?", [hashed, email]);
  delete otpStore[email];

  res.status(200).json({ success: true, message: "Password reset successfully" });
};
