import mongoose from "mongoose";
import Quest from "../models/quests/quest.js"
import Creator from "../models/creators/creator.js"
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

import {check, validationResult} from "express-validator"


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
        .withMessage('The reward per video cannot be empty!')
  ];

  
export const handleQuestCreation = async(req, res)=>{
    console.log('submitted body ', req.body)
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      console.log("There were errors", errors.array())
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const quest = new Quest({
            createdByAddress: req.userWalletAddress,
            title: req.body.title,
            brandName: req.body.brand,
            brandImageUrl: req.body.imageUrl,
            description: req.body.longDescription,
            // rewardCriteria: req.body.rewardCriteria,
            prizePoolUsd: req.body.prizePool,
            minFollowerCount: req.body.minFollowers || 0,
            endsOn: req.body.deadline,
            pricePerVideo: req.body.rewardPerVideo,
            videosToBeAwarded: req.body.videosToReward
        });
        await quest.save();
        res.status(201).json({ message: "Quest created successfully", quest });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while creating quest" });
      }
}

export const getAllQuests = async(req, res)=>{
  try{
    
    // const allQuests = await Quest.find({visibleOnline: true}).lean().exec()
    const allQuests = await Quest.find({visibleOnline: true}, {brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1, pricePerVideo: 1 }).sort({ createdAt: -1 }).lean().exec()
    return res.status(200).json({allQuests})
  }catch(e){
    return res.status(500).json({"error": e.message})
  }
}

export const getSingleQuest = async(req, res)=>{
  try{
    const quest = await Quest.findById(req.params.questID).lean().exec()
    if(quest){
      return res.status(200).json({quest})
    }else{
      return res.status(404)
    }
  }catch(e){
    return res.status(500).json({"error": e.message})
  }
}

export const get3questsOnly = async(req, res)=>{
  try {
    const _3quests = await Quest.find({visibleOnline: true}, {brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1, pricePerVideo: 1 }).sort({ createdAt: -1 }).limit(3).lean().exec()
    return res.status(200).json({_3quests})
  } catch (error) {
    return res.status(500).json({"error": error.message})
  }
}

export const validate_questSubmission=[
  check("platform")
    .notEmpty().withMessage("Social media platform was not selected!")
    .trim(),
  check("contentUrl")
    .notEmpty().withMessage("Video URL should not be empty!")
    .isURL().withMessage('The Video URL submitted is not valid')
    .trim()
]

export const submitQuestByCreator = async(req, res)=>{
  console.log('submitted body ', req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("There were errors", errors.array())
    const firstError = errors.array()[0];
    return res.status(400).json({ error: firstError});
  }

  try {
    const questID = req.params.questID
    const walletID = req.userWalletAddress

    // Check if user has already submitted to this quest
    const existingQuest = await Quest.findOne({
      _id: questID,
      'submissions.submittedByAddress': walletID
    });

    if (existingQuest) {
      return res.status(400).json({ 
        error: { 
          msg: "Oops..You cannot submit a single quest twice😪" 
        } 
      });
    }
    
  
    const updatedQuest = await submitQuest(walletID, questID, req.body.platform, req.body.contentUrl)
    return res.status(200).json({updatedQuest})
  } catch (error) {
    return res.status(500).json({"error": error.message})
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
            {new: true}
        )

        // console.log(updatedQuest)

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

    // Update creator data
    if(platform.toLowerCase() === 'twitter'){
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
        // console.log('twitterResponse.data is ', twitterResponse.data)
        // console.log('')
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
        console.log(error)
        throw error
      }
    }

    // Update submission data
    if(platform.toLowerCase() === 'twitter'){
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


        return updatedQuest
    } catch (error) {
      console.log('error ', error)
        throw error
    }
}


function extractTwitterUsername(url) {
  try {
    const cleanedUrl = url.split('?')[0]; // Remove query parameters
    const match = cleanedUrl.match(/x\.com\/([^/]+)\/status/);
    return match ? match[1] : null;
  } catch {
    console.log('twitter name could not be extracted!')
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