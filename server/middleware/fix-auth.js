import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const fixRequireAuth = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];


  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    //  req.userWalletAddress = payload.address; // ✅ assign wallet addre
    //  req.userWalletAddress = "0xf2035672d5db6dfd64b91046fC0dA244E6c432bf"
     req.userWalletAddress = "0xf2035672d5db6dfd64b91046fC0dA244E6c432bf"
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
