import express from 'express'
const router = express.Router()

import {requireAuth} from "../middleware/auth.js"
import {creatorProfile, getSimulatedCreators} from "../controllers/creatorController.js"

router.get('/', requireAuth, creatorProfile)
router.get('/simulatedCreators', getSimulatedCreators)
export default router