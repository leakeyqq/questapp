import Decimal from 'decimal.js'
import Quest from "./../models/quests/quest.js"
export const fetchMyCreatedQuests = async(req, res)=>{
    try {
        
        const allMyCreatedQuests = await Quest.find({createdByAddress: req.userWalletAddress}).lean().exec()
        return res.status(200).json({quests: allMyCreatedQuests})
    } catch (error) {
        return res.status(500).json({"error": error.message})
    }
}
export const fetchMySingleCreatedQuest = async(req, res)=>{
    try {
        const questID = req.params.questID
        const userWalletAddress = req.userWalletAddress

        if(typeof(questID) == 'undefined' || questID == null){
            return res.status(400).json({error:'cannot get questID from input'})
        }
        const singleQuest = await Quest.findById(questID).lean().exec()
        if(singleQuest){

            if(singleQuest.createdByAddress.toLowerCase() == userWalletAddress){
                console.log('my quest is ', singleQuest)
                return res.status(200).json({quest: singleQuest})

            }else{
                return res.status(401).json({error: "Unauthorized!"})

            }
        }else{
            return res.status(404).json({error: "Could not find quest!"})
        }
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const getTotalFundsSpent = async(req, res)=>{
    const walletAddress = req.userWalletAddress

    try {
        let totalSpent = new Decimal(0);    
        // const allMyCreatedQuests = await Quest.find({createdByAddress: walletAddress}).lean().exec()
        const allMyCreatedQuests = await Quest.find({
            createdByAddress: new RegExp(`^${walletAddress}$`, 'i')
          }).lean().exec();
    
        for(const quest of allMyCreatedQuests){
            if(quest.prizePoolUsd && typeof quest.prizePoolUsd === 'string'){
                try {
                    const prizeAmount = new Decimal(quest.prizePoolUsd);
                    totalSpent = totalSpent.plus(prizeAmount);
                } catch (error) {
                    throw error
                }
            }
        }

        totalSpent = totalSpent.toString()
        console.log('funds spent ', totalSpent)
        return res.status(200).json({totalSpent})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }


}