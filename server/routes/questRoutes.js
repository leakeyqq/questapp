import express from "express"
const router = express.Router()

import {validate_createQuest, handleQuestCreation, getAllQuests, getSingleQuest} from "../controllers/questController.js"
import {requireAuth} from "../middleware/auth.js"

router.post("/create", requireAuth, validate_createQuest, handleQuestCreation)
router.get("/allQuests", getAllQuests)
router.get("/getSingleQuest/:questID", getSingleQuest)

export default router;