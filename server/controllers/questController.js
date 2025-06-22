import mongoose from "mongoose";
import Quest from "../models/quests/quest.js"
import Creator from "../models/creators/creator.js"
import dotenv from 'dotenv'
import axios from 'axios';
import * as cheerio from 'cheerio';
import chalk from 'chalk';

dotenv.config()

import { check, validationResult } from "express-validator"


export const validate_createQuest = [
  check("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ max: 100 })
    .withMessage("Brand name must not exceed 100 characters"),

  check("title")
    .trim()
    .notEmpty()
    .withMessage("Quest title is required")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),

  check("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  // check("description")
  //   .isLength({ min: 20 })
  //   .withMessage("Short description must be 20 characters or more"),

  check("longDescription")
    .trim()
    .notEmpty()
    .withMessage("Detailed description is required")
    // .isLength({ min: 20 })
    .withMessage("Detailed description must be at least 20 characters long"),

  check("prizePool")
    .notEmpty()
    .withMessage("Prize pool is required"),
  // .isFloat({ gt: 0 })
  // .withMessage("Prize pool must be a positive number"),

  check("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .toDate()
    .withMessage("Deadline must be a valid date"),

  check("minFollowers")
    .optional(),
  // .isInt({ min: 0 })
  // .withMessage("Minimum followers must be a non-negative integer"),

  check("imageUrl")
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  // You can add more fields as needed.
  // check("rewardCriteria")
  //     .notEmpty()
  //     .withMessage('Reward criteria should not be empty!'),

  check("videosToReward")
    .notEmpty()
    .withMessage('The number of videos to reward cannot be empty'),
  check("rewardPerVideo")
    .notEmpty()
    .withMessage('The reward per video cannot be empty!'),

  check("onchainQuestId")
    .notEmpty()
    .withMessage('Onchain quest ID is missing!'),
  check("rewardToken")
    .notEmpty()
    .withMessage("Reward token missing!"),
];


export const handleQuestCreation = async (req, res) => {
  console.log('quest creation ', req.body)
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Process platform requirements
    const platformRequirements = req.body.platformRequirements || [];

    // Map platform requirements to socialPlatformsAllowed structure
    const socialPlatformsAllowed = {
      twitter: { allowedOnCampaign: false, minFollowers: 0 },
      tiktok: { allowedOnCampaign: false, minFollowers: 0 },
      instagram: { allowedOnCampaign: false, minFollowers: 0 }
    };


    platformRequirements.forEach(req => {
      if (!req.platform) return;

      const platformKey = req.platform.includes('TikTok') ? 'tiktok' :
        req.platform.includes('Instagram') ? 'instagram' :
          req.platform.includes('Twitter') ? 'twitter' : null;

      if (platformKey) {
        socialPlatformsAllowed[platformKey] = {
          allowedOnCampaign: req.enabled || false,
          minFollowers:  req.enabled ? (req.minFollowers ? parseInt(req.minFollowers) : 0) : 0
        };
      }
    });

    // Determine approval needed based on participation type
    const approvalNeeded = req.body.participationType === 'approval';


    // Create quest document
    const quest = new Quest({
      createdByAddress: req.userWalletAddress,
      onchain_id: req.body.onchainQuestId,
      title: req.body.title,
      brandName: req.body.brand,
      brandImageUrl: req.body.imageUrl,
      description: req.body.longDescription,
      prizePoolUsd: req.body.prizePool,
      minFollowerCount: req.body.minFollowers ? parseInt(req.body.minFollowers) : 0,
      endsOn: req.body.deadline,
      pricePerVideo: req.body.rewardPerVideo,
      videosToBeAwarded: parseInt(req.body.videosToReward),
      rewardToken: req.body.rewardToken,
      approvalNeeded,
      socialPlatformsAllowed,
      visibleOnline: true,
      // applicants: [],
      // submissions: []
    });


    await quest.save();
    res.status(201).json({ message: "Quest created successfully", quest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating quest" });
  }
}

export const getAllQuests = async (req, res) => {
  try {

    // const allQuests = await Quest.find({visibleOnline: true}).lean().exec()
    const allQuests = await Quest.find({ visibleOnline: true }, { brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1, pricePerVideo: 1, onchain_id: 1, rewardToken: 1 }).sort({ createdAt: -1 }).lean().exec()
    return res.status(200).json({ allQuests })
  } catch (e) {
    return res.status(500).json({ "error": e.message })
  }
}

export const getSingleQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.questID).lean().exec()
    if (quest) {
      return res.status(200).json({ quest })
    } else {
      return res.status(404)
    }
  } catch (e) {
    return res.status(500).json({ "error": e.message })
  }
}

export const get3questsOnly = async (req, res) => {
  try {
    const _3quests = await Quest.find({ visibleOnline: true }, { brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1, pricePerVideo: 1, onchain_id: 1, rewardToken: 1 }).sort({ createdAt: -1 }).limit(3).lean().exec()
    return res.status(200).json({ _3quests })
  } catch (error) {
    return res.status(500).json({ "error": error.message })
  }
}

export const validate_questSubmission = [
  check("platform")
    .notEmpty().withMessage("Social media platform was not selected!")
    .trim(),
  check("contentUrl")
    .notEmpty().withMessage("Video URL should not be empty!")
    .isURL().withMessage('The Video URL submitted is not valid')
    .trim()
]

export const submitQuestByCreator = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({ error: firstError });
  }

  try {
    const questID = req.params.questID
    const walletID = req.userWalletAddress

    // Check if user has already submitted to this quest
    const existingQuest = await Quest.findOne({
      _id: questID,
      'submissions.submittedByAddress': walletID
    });

    // if (existingQuest) {
    //   return res.status(400).json({ 
    //     error: { 
    //       msg: "Oops..You cannot submit a single quest twice😪" 
    //     } 
    //   });
    // }


    const updatedQuest = await submitQuest(walletID, questID, req.body.platform, req.body.contentUrl)
    return res.status(200).json({ updatedQuest })
  } catch (error) {
    return res.status(500).json({ "error": error.message })
  }


}


async function submitQuest(walletID, questID, platform, contentUrl) {
  try {
    const updatedQuest = await Quest.findByIdAndUpdate(
      questID,
      {
        $push: {
          submissions: {
            submittedByAddress: walletID,
            socialPlatformName: platform,
            videoLink: contentUrl,
            submittedAtTime: new Date()
          }
        }
      },
      { new: true }
    )


    // Update creator profile
    const updatedCreator = await Creator.findOneAndUpdate(
      { creatorAddress: walletID },
      {
        $push: {
          questsDone: {
            questID: questID,
            platformPosted: platform,
            videoUrl: contentUrl,
            submittedOn: new Date()
          }
        }
      },
      {
        upsert: true,
        new: true,
      }
    );


    if (platform.toLowerCase() === 'twitter') {
      await pullTwitterData(walletID, contentUrl, questID)
    }
    if (platform.toLowerCase() === 'tiktok') {
      await pullTikTokData(contentUrl, walletID, questID)
    }

    return updatedQuest
  } catch (error) {
    throw error
  }
}


function extractTwitterUsername(url) {
  try {
    const cleanedUrl = url.split('?')[0]; // Remove query parameters
    const match = cleanedUrl.match(/x\.com\/([^/]+)\/status/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
function extractTweetId(url) {
  try {
    const urlObj = new URL(url);
    const validHosts = ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'];
    if (!validHosts.includes(urlObj.hostname)) {
      return null;
    }

    const match = urlObj.pathname.match(/status\/(\d+)/);
    return match ? match[1] : null;
  } catch (err) {
    console.error("Invalid URL format:", url);
    return null;
  }
}
async function pullTwitterData(walletID, contentUrl, questID) {
  // Update creator data
  try {
    let twitterUsername = extractTwitterUsername(contentUrl)
    const twitterOptions = {
      method: 'GET',
      url: 'https://api.twitterapi.io/twitter/user/info',
      params: { userName: twitterUsername },
      headers: {
        'x-api-key': process.env.TWITTER_API_IO,
      },
    };

    const twitterResponse = await axios.request(twitterOptions);
    if (twitterResponse.data?.status === 'success') {
      const twitterData = twitterResponse.data.data;
      // Attach twitterData only if it exists
      if (twitterData) {
        // First, unset the field
        await Creator.updateOne(
          { creatorAddress: walletID },
          { $unset: { twitterData: "" } }
        );

        const creatorUpdateData = {
          $set: { twitterData }
        };
        const updatedCreator = await Creator.findOneAndUpdate(
          { creatorAddress: walletID },
          creatorUpdateData,
          {
            upsert: true,
            new: true,
          }
        );
      }
    }

  } catch (error) {
    throw error
  }

  // Update submission data
  try {
    const tweetId = extractTweetId(contentUrl);
    if (!tweetId) throw new Error("Invalid tweet URL");

    const twitterStatsOptions = {
      method: 'GET',
      url: 'https://api.twitterapi.io/twitter/tweets',
      params: { tweet_ids: tweetId },
      headers: { 'x-api-key': process.env.TWITTER_API_IO }
    };

    const statsResponse = await axios.request(twitterStatsOptions);
    const tweetData = statsResponse.data?.tweets?.[0];

    if (!tweetData) throw new Error("Tweet data not found");

    await Quest.updateOne(
      {
        _id: questID,
        submissions: {
          $elemMatch: {
            submittedByAddress: walletID,
            videoLink: contentUrl
          }
        }
      },
      {
        $set: {
          "submissions.$.twitterData": tweetData
        }
      }
    );



  } catch (error) {
    throw error
  }

}
async function pullTikTokData(videoUrl, walletID, questID) {
  const headers = {
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  try {
    const response = await axios.get(videoUrl, { headers });

    if (response.status !== 200) {
      throw new Error(`Request blocked for ${videoUrl}`);
    }

    const $ = cheerio.load(response.data);
    const scriptTag = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();

    if (!scriptTag) {
      throw new Error(`No data script tag found for ${videoUrl}`);
    }

    const rawJson = JSON.parse(scriptTag);
    const videoData = rawJson.__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo?.itemStruct;

    if (!videoData) {
      throw new Error(`Video info not found in JSON for ${videoUrl}`);
    }

    const videoInfo = {
      id: videoData.id,
      desc: videoData.desc,
      createTime: videoData.createTime,
      author: videoData.author?.uniqueId,
      stats: videoData.stats,
      videoUrl: videoData.video?.playAddr,
    };



    // First, unset the field

    // Map TikTok data from API to your schema
    const tiktokData_author = {
      id: videoData.author?.id,
      uniqueId: videoData.author?.uniqueId,
      nickname: videoData.author?.nickname,
      avatarThumb: videoData.author?.avatarThumb,
      createTime: videoData.createTime
        ? new Date(parseInt(videoData.createTime) * 1000)
        : undefined,
      verified: videoData.author?.verified,
      followerCount: videoData.authorStatsV2?.followerCount,
      followingCount: videoData.authorStatsV2?.followingCount,
      heartCount: videoData.authorStatsV2?.heartCount,
      videoCount: videoData.authorStatsV2?.videoCount,
      diggCount: videoData.authorStatsV2?.diggCount,
      friendCount: videoData.authorStatsV2?.friendCount,
    };

    const tiktokData = {
      id: videoData?.id,
      createTime: videoData?.createTime
        ? new Date(parseInt(videoData.createTime) * 1000)
        : undefined,
      author: tiktokData_author,
      diggCount: videoData?.statsV2?.diggCount,
      shareCount: videoData?.statsV2?.shareCount,
      commentCount: videoData?.statsV2?.commentCount,
      playCount: videoData?.statsV2?.playCount,
      collectCount: videoData?.statsV2?.collectCount,
      repostCount: videoData?.statsV2?.repostCount,
      locationCreated: videoData?.locationCreated || null // if present
    }



    await Creator.updateOne(
      { creatorAddress: walletID },
      { $unset: { tiktokData: "" } }
    );

    const creatorUpdateData = {
      $set: { tiktokData: tiktokData_author }
    };

    const updatedCreator = await Creator.findOneAndUpdate(
      { creatorAddress: walletID },
      creatorUpdateData,
      {
        upsert: true,
        new: true,
      }
    );

    await Quest.updateOne(
      {
        _id: questID,
        submissions: {
          $elemMatch: {
            submittedByAddress: walletID,
            videoLink: videoUrl
          }
        }
      },
      {
        $set: {
          "submissions.$.tiktokData": tiktokData
        }
      }
    );

    return videoInfo;
  } catch (error) {
    console.error(chalk.red(`❌ Error scraping video ${videoUrl}: ${error.message}`));
    return null;
  }

}