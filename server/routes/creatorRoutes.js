import express from 'express'
const router = express.Router()

import {requireAuth} from "../middleware/auth.js"
import {creatorProfile, getSimulatedCreators, linkProfile, getAllCreators, getCreatorPoints} from "../controllers/creatorController.js"

router.get('/', requireAuth, creatorProfile)
router.get('/simulatedCreators', getSimulatedCreators)
router.post('/linkProfile', requireAuth, linkProfile)
router.get('/creatorsBoard', getAllCreators)
router.get('/getPoints', requireAuth, getCreatorPoints)
export default router