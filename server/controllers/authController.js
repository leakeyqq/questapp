import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import User from "../models/users/userInfo.js"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // or whatever you want

export const login = async (req, res) => {
  // console.log('User trying to log in')
  
  // Log the received payload from the client
  console.log("🔐 Login attempt - Received payload from client:", req.body);
  
  const { address } = req.body;

  if (!address) {
    // console.log('no address')
    console.log("❌ Login failed - No wallet address provided");
    return res.status(400).json({ error: "Wallet address is required" });
  }

  let user;
  
  try{
    user = await User.findOne({walletAddress: address})
    // console.log('user is ', user)

    if(!user){
      // console.log('no user found, creating a user now')
      console.log("👤 Creating new user for address:", address);
      user = await User.create({walletAddress: address})
      console.log("✅ New user created:", user);
    }else{
      // console.log('user was found in db')
      // console.log("👤 Existing user found:", user);
    }
    // console.log('user data is on db')
  }catch(e){
    console.log("❌ Database error during login:", e.message);
    return res.status(500).json({error: e.message})
  }

  // Optionally validate address format (0x...)
  const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  // Prepare the response object that will be sent to client
  const responseData = { success: true, address };
  
  // Prepare the complete response structure that matches client expectations
  const completeResponse = {
    responseData: responseData,
    userFromDB: user,
    tokenGenerated: token
  };
  
  // Log the user object being returned to the client
  console.log("✅ Login successful - User object being returned to client:", {
    userFromDB: user,
    responseData: responseData,
    tokenGenerated: "***TOKEN_HIDDEN***"
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(completeResponse);
};

export const logout = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out" });
};

export const getMe = (req, res) => {
  const user = req.user;
  res.json({ success: true, user });
};
