import express from "express"
const router = express.Router()

import {fetchMyCreatedQuests, fetchMySingleCreatedQuest, getTotalFundsSpent} from "../controllers/brandController.js"
import {requireAuth} from "../middleware/auth.js"

router.get('/myCreatedQuests', requireAuth, fetchMyCreatedQuests)
router.get('/mySingleCreatedQuest', requireAuth, fetchMySingleCreatedQuest )
router.get('/getTotalFundsSpent',requireAuth, getTotalFundsSpent)

export default router