import mongoose from "mongoose";
import Quest from "../models/quests/quest.js"
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
      .withMessage("Prize pool is required")
      .isFloat({ gt: 0 })
      .withMessage("Prize pool must be a positive number"),
  
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
    check("rewardCriteria")
        .notEmpty()
        .withMessage('Reward criteria should not be empty!')
  ];

  
export const handleQuestCreation = async(req, res)=>{
    console.log('submitted body ', req.body)
    const errors = validationResult(req);
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
            rewardCriteria: req.body.rewardCriteria,
            prizePoolUsd: req.body.prizePool,
            minFollowerCount: req.body.minFollowers || 0,
            endsOn: req.body.deadline
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
    const allQuests = await Quest.find({visibleOnline: true}, {brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1 }).lean().exec()
    return res.status(200).json({allQuests})
  }catch(e){
    return res.status(500).json({"error": e.message})
  }
}

export const getSingleQuest = async(req, res)=>{
  console.log('asked for a single quest')
  try{
    const quest = await Quest.findById(req.params.questID).lean().exec()
    console.log('quest ', quest)

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
    const _3quests = await Quest.find({visibleOnline: true}, {brandName: 1, brandImageUrl: 1, description: 1, prizePoolUsd: 1, endsOn: 1 }).limit(3).lean().exec()
    return res.status(200).json({_3quests})
  } catch (error) {
    return res.status(500).json({"error": error.message})
  }
}