import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Email and new password required" });
    }

    const [users] = await connectDB.execute("SELECT * FROM register WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await connectDB.execute("UPDATE register SET password = ? WHERE email = ?", [hashed, email]);

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
