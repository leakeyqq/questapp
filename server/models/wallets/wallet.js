import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    userAddress: {
        type: String,
        required: true
    },
    onchainWithdrawals: {
        network: {
            type: String,
            required: true
        },
        tokenSymbol: {
            type: String,
            required: false
        },
        txHash: {
            type: String,
            required: true
        },
        toAddress: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: false
        },
        occurredAt: {
            type: Date,
            required: true
        }

    }
}, {timestamps: true})

const Wallet = mongoose.model("wallets", walletSchema, "wallet")
export default Wallet