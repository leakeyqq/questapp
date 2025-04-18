import express from "express"
// const session = require("express-session");
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()

import authRoutes from "./routes/authRoutes.js"
import questRoutes from "./routes/questRoutes.js"

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: ["http://localhost:5000", "http://localhost:3000", "https://d734-102-217-172-54.ngrok-free.app", "https://e49a-102-217-172-54.ngrok-free.app"],
//   credentials: true,
// }));


app.use(cors({
  origin: (origin, callback) => {
    console.log('Origin is ', origin)
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://1e9a-102-217-172-54.ngrok-free.app",
      "https://87d4-102-217-172-54.ngrok-free.app"
    ];

    if (allowedOrigins.includes(origin) || !origin) {
      console.log('Has been allowed by CORS')
      callback(null, true);
    } else {
      console.log('Not allowed by CORS')
      callback(new Error("Not allowed by CORS!!!"));
    }
  },
  credentials: true,
}));


mongoose.connect(process.env.MONGODB_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.get("/ping", (req, res) => {
  res.send("pong from server");
});
app.use("/api/auth", authRoutes);
app.use("/api/quest", questRoutes)

app.use("*", (req, res) => {
  console.log(`[${req.method}] Unhandled request to: ${req.originalUrl}`);
  if (Object.keys(req.body).length) {
    console.log("Request body:", req.body);
  }
});


const PORT = process.env.SERVER_PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
