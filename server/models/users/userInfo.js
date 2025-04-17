import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        walletAddress: {
            type: String,
            // unique: true,
            lowercase: true,
            trim: true,
            required: true
        }
    },{timestamps: true}
)

const User = mongoose.model("users", userSchema, "users")
export default User

