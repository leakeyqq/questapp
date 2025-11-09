import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        walletAddress: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true
        },
        selfProtocol: {
            verified: {
                type: Boolean,
                default: false
            },
            countryOfUser: {
                type: String,
                required: false
            }
        },
        web3auth: {
            emailAddress: {
                type: String,
                required: false
            },
            names: {
                type: String,
                required: false
            },

            profilePhoto: {
                type: String,
                required: false
            },
            aggregateVerifier: {
                type: String,
                required: false
            },
            loginMethod: {
                type: String,
                enum: ['google', 'manual']
            }
        }

    },{timestamps: true}
)

const User = mongoose.model("users", userSchema, "users")
export default User

