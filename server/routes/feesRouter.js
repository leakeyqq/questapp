import express from 'express'
const router = express.Router()

import {fundFeesOnWallet, customFundFeesOnWallet, customFundFeesOnWallet_base} from '../controllers/chainFeesController.js'
import { fundSolFees } from '../controllers/solFeesController.js'
import {requireAuth} from "../middleware/auth.js"


router.get('/prepare-deposit' , requireAuth, fundFeesOnWallet)
router.post('/gas-estimate', requireAuth, customFundFeesOnWallet)
router.post('/gas-estimate-base', requireAuth, customFundFeesOnWallet_base)
router.post('/fundSolFees', requireAuth, fundSolFees)
export default router