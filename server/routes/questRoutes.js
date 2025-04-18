import express from "express"
const router = express.Router()

import {validate_createQuest, handleQuestCreation} from "../controllers/questController.js"
import {requireAuth} from "../middleware/auth.js"

router.post("/create", requireAuth, validate_createQuest, handleQuestCreation)

export default router;