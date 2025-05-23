import mongoose from "mongoose"

const creatorSchema = new mongoose.Schema({
    creatorAddress: {
        type: String,
        required: false
    },
    totalEarnings: {
        type: String,
        default: '0'
    },
    totalWithdrawn: {
        type: String,
        default: '0'
    },
    earningsBalance: {
        type: String,
        default: '0'
    },
    questsDone: [{
        _id: false,
        questID: {
            type: String,
            required: false
        },
        submissionRewarded: {
            type: Boolean,
            default: false
        },
        submissionRejected: {
            type: Boolean,
            default: false
        },
        rewardedAmount: {
            type: String,
            default: '0'
        },
        platformPosted: {
            type: String,
            required: false
        },
        videoUrl: {
            type: String,
            required: false
        },
        submittedOn: {
            type: Date,
            required: true
        },
        rewardedOn: {
            type: Date,
            required: false
        }
    }]
}, {timestamps: true})

const Creator = mongoose.model("creators", creatorSchema, 'creators')
export default Creator