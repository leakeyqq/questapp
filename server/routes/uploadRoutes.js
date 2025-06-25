import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-image", requireAuth, upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    // Use the first file
    const file = req.files[0];
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const imageUrl = await uploadToCloudinary(fileStr);
    res.json({ url: imageUrl, success: true });
    console.log("Image uploaded successfully:", url);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router; 