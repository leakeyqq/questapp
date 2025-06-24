import express from "express";
import { 
  getExchangeRate, 
  validateAccount, 
  processPayment, 
  getBanks, 
  getTransactionStatus 
} from "../controllers/pretiumController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Exchange rate endpoint - protected
router.post("/exchange-rate", requireAuth, getExchangeRate);

// Validation endpoints - protected
router.post("/validation", requireAuth, validateAccount); // Default (KES)
router.post("/validation/:currency", requireAuth, validateAccount); // Other currencies (UGX, GHS, NGN)

// Payment endpoints - protected (critical for security)
router.post("/pay", requireAuth, processPayment); // Default (KES)
router.post("/pay/:currency", requireAuth, processPayment); // Other currencies (UGX, GHS, NGN)

// Banks endpoint - can be public for UI purposes
router.post("/banks", getBanks);

// Status endpoints - protected
router.post("/status", requireAuth, getTransactionStatus); // Default (KES)
router.post("/status/:currency", requireAuth, getTransactionStatus); // Other currencies (UGX, GHS, NGN)

export default router; 