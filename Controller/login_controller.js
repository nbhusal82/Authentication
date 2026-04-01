import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & Password required!" });
    }

  
    const [users] = await connectDB.execute(
      "SELECT * FROM register WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(400).json({ success: false, message: "Password not set for this user" });
    }

    const isMatch = await bcrypt.compare(String(password), String(user.password));
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.expire }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
      expiresAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      status: "success",
      message: "Logout success",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
