import connectDB from "../config/db.js"
import bcrypt from "bcrypt"

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const connection = await connectDB()
        const [rows] = await connection.execute("SELECT * FROM register WHERE email = ?", [email])

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        const user = rows[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }

        res.status(200).json({ success: true, message: "Login successful", user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export default loginUser
