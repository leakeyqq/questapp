import express from "express"
const router = express.Router()

import {requireAuth} from "../middleware/auth.js"
import {saveWithdrawalTx, confirmMpesaName, submitOfframpRequest} from "../controllers/walletController.js"

router.post('/saveWithdrawal', requireAuth, saveWithdrawalTx)
router.post('/confirmMpesaNames', requireAuth ,confirmMpesaName)
router.post('/submitOfframpRequest', submitOfframpRequest )
// module.exports = router
export default router