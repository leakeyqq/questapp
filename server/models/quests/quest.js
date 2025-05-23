import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
    createdByAddress: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    brandImageUrl: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    rewardCriteria: {
        type: String,
        required: false
    },
    prizePoolUsd: {
        type: String,
        required: String
    },
    pricePerVideo: {
        type: String,
        required: false
    },
    videosToBeAwarded: {
        type: Number,
        required: false
    },
    submissions: [
        {
            submittedByAddress: {
                type: String,
                required: false
            },
            socialPlatformName: {
                type: String,
                required: false
            },
            videoLink: {
                type: String,
                required: false
            },
            comments: {
                type: String,
                required: false
            },
            rewarded: {
                type: Boolean,
                default: false
            },
            rewardAmountUsd: {
                type: String,
                default: '0'
            },
            submissionRead: {
                type: Boolean,
                default: false
            },
            submittedAtTime: {
                type: Date,
                required: false
            },
            rewardedAtTime:{
                type: Date,
                required: false
            }
        }
    ],
    minFollowerCount: {
        type: Number,
        default: 0
    },
    visibleOnline: {
        type: Boolean,
        default: true
    },
    endsOn: {
        type: Date,
        required: true
    }
}, {timestamps: true})

const Quest = mongoose.model("quests", questSchema, "quests")
export default Quest