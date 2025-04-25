import express from 'express'
const router = express.Router()

import {fundFeesOnWallet} from '../controllers/celoFeesController.js'
import {requireAuth} from "../middleware/auth.js"


router.get('/prepare-deposit', requireAuth, fundFeesOnWallet)

export default router