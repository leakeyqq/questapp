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
            },
            twitterData: {
                id: {type: String, required: false},
                text: {type: String, required: false},
                retweetCount: {type: Number, required: false},
                replyCount: {type: Number, required: false},
                likeCount: {type: Number, required: false},
                quoteCount: {type: Number, required: false},
                viewCount: {type: Number, required: false},
                createdAt: {type: Date, required: false},
                lang: {type: String, required: false},
                bookmarkCount: {type: Number, required: false},
                isReply: {type: Boolean, required: false},
                isPinned: {type: Boolean, required: false},
                isRetweet: {type: Boolean, required: false},
                isQuote: {type: Boolean, required: false},
                isConversationControlled: {type: Boolean, required: false},
                author: {
                    userName: {type: String, required: false},
                    id: {type: String, required: false},
                    name: {type: String, required: false},
                    isVerified: {type: Boolean, required: false},
                    isBlueVerified: {type: Boolean, required: false},
                    profilePicture: {type: String, required: false},
                    location: {type: String, required: false},
                    followers: {type: Number, required: false},
                    following: {type: Number, required: false}
                }
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