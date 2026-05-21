import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import loginRoutes from "./Routes/login_routes.js";
import registerRoutes from "./Routes/register_routes.js";
import otpRoutes from "./Routes/otp_routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", otpRoutes);

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
