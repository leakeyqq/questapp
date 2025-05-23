import express from 'express'
const router = express.Router()

import {requireAuth} from "../middleware/auth.js"
import {creatorProfile} from "../controllers/creatorController.js"

router.get('/', requireAuth, creatorProfile)

export default router