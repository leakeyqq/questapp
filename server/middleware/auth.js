import jwt from "jsonwebtoken";
import User from "../models/users/userInfo.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("🔒 Access denied - No token provided");
      return res.status(401).json({ 
        error: "Access denied. No token provided.",
        success: false 
      });
    }

    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Fetch user data from database
    const user = await User.findOne({ walletAddress: payload.address });
    
    if (!user) {
      console.log("🔒 Access denied - User not found for address:", payload.address);
      return res.status(401).json({ 
        error: "Access denied. User not found.",
        success: false 
      });
    }

    // Attach user data to request object
    req.user = payload;
    req.userWalletAddress = payload.address;
    req.userData = user; // Full user object from database
    
    // console.log("✅ Authentication successful for user:", payload.address);
    next();
    
  } catch (error) {
    console.log("🔒 Authentication failed:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Access denied. Invalid token.",
        success: false 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Access denied. Token expired.",
        success: false 
      });
    }
    
    return res.status(500).json({ 
      error: "Internal server error during authentication.",
      success: false 
    });
  }
};

// Optional middleware for routes that work with or without auth
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      // No token provided, but that's okay for optional auth
      // console.log("ℹ️ No token provided for optional auth route");
      return next();
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ walletAddress: payload.address });
    
    if (user) {
      req.user = payload;
      req.userWalletAddress = payload.address;
      req.userData = user;
      // console.log("✅ Optional authentication successful for user:", payload.address);
    }
    
    next();
    
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    // console.log("ℹ️ Optional auth failed, continuing without authentication:", error.message);
    next();
  }
};
