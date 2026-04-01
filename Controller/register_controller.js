import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const [existing] = await connectDB.execute(
      "SELECT * FROM register WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute(
      "INSERT INTO register (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default registerUser;
