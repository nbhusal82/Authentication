import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import loginRoutes from "./Routes/login_routes.js";
import registerRoutes from "./Routes/register_routes.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
try {
  await connectDB();
  console.log("Database Connected");
} catch (error) {
  console.log("Database Connection Failed", error.message);
}
app.use("/api", loginRoutes)
app.use("/api", registerRoutes)
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
