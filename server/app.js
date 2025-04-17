import express from "express"
// const session = require("express-session");
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()

import authRoutes from "./routes/authRoutes.js"

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:3000", "https://03b9-102-1-140-120.ngrok-free.app", "https://2c74-102-1-140-120.ngrok-free.app"],
  credentials: true,
}));



mongoose.connect(process.env.MONGODB_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/api/auth", authRoutes);


const PORT = process.env.SERVER_PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
