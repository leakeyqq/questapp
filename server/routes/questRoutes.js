import express from "express"
const router = express.Router()

import {validate_createQuest, handleQuestCreation, getAllQuests, getSingleQuest, get3questsOnly, validate_questSubmission, submitQuestByCreator, shareQuestToFriends} from "../controllers/questController.js"
import {requireAuth, optionalAuth} from "../middleware/auth.js"

router.post("/create", requireAuth, validate_createQuest, handleQuestCreation)
router.get("/allQuests",optionalAuth, getAllQuests)
router.get("/getSingleQuest/:questID", optionalAuth, getSingleQuest)
router.get("/get3QuestsOnly", optionalAuth, get3questsOnly)
router.post("/submitQuest/:questID",requireAuth, validate_questSubmission, submitQuestByCreator)
router.get("/shareQuest/:questID", optionalAuth, shareQuestToFriends)
export default router;