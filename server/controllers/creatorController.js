import Quest from "./../models/quests/quest.js"
import Creator from "./../models/creators/creator.js"

export const creatorProfile = async(req, res)=>{
    try{
        let creator = await Creator.findOne({creatorAddress: req.userWalletAddress }).lean().exec()
        if(creator){
            // Get all unique quest IDs from questsDone
            const questIds = creator.questsDone.map(q => q.questID);

            // Fetch all quests in parallel
            const quests = await Quest.find({ _id: { $in: questIds } }).lean().exec();

            // Map quests with their reward status and amount
            const enrichedQuests = creator.questsDone.map(questDone => {
                const quest = quests.find(q => q._id.toString() === questDone.questID);
                return {
                    ...quest,
                    _submissionRewarded: questDone.submissionRewarded,
                    _submissionRejected: questDone.submissionRejected,
                    _rewardedAmount: questDone.rewardedAmount,
                    _platformPosted: questDone.platformPosted,
                    _videoUrl: questDone.videoUrl,
                    _submittedOn: questDone.submittedOn
                };
            });
            console.log('quests ', enrichedQuests)
            return res.status(200).json({creator, quests: enrichedQuests})
        }else{
            console.log('not found')
            return res.status(404)
        }
    }catch(e){
        console.log(e)
        return res.status(500).json({error: e})
    }

}