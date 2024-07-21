import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchadnler } from "../utils/asynhandler.js"

const createTweet = asynchadnler(async (req, res) => {
    //TODO: create tweet
    const {content}= req.body;
    if(!content){throw new ApiError(300,"Content required ")}

    const user= await User.findById(req.user?._id)
    
    const tweet = await Tweet.create({
        content,
        owner:user._id
    })

    return res.status(200).json(new ApiResponse(200,tweet,"Tweet created successfully"))

})

const getUserTweets = asynchadnler(async (req, res) => {
    // TODO: get user tweets
    const {userId}= req.params

    try {
        const tweets= await Tweet.find(
            {
                owner:userId
            },
            {
                _id:0
            }
        )
    
        if (tweets.length === 0) {
            throw new ApiError(400, "tweet doesn't exist");
        }

        res.status(200).json(new ApiResponse(200,tweets,"Every playlist"))
    
    } catch (error) {
        res.status(500).json(new ApiError(500, error,"Can't find tweet or display it "));
    }

})

const updateTweet = asynchadnler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}= req.params;

    const {content}= req.body;
    if(!content){throw new ApiError(300,"Content required ")}

    try {
        const tweet= await Tweet.findById(tweetId)
    
        tweet.content= content;
        await tweet.save()

        res.status(200).json(new ApiResponse(200,tweet,"Updated succefully"))
    
    } catch (error) {
        res.status(500).json(new ApiError(500,error,"couldn't update"))
    }

})

const deleteTweet = asynchadnler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}= req.params;
    try {
        const tweet= await Tweet.deleteOne({_id:tweetId})
    
        res.status(200).json(new ApiResponse(200,tweet,"deleted succefully"))
    
    } catch (error) {
        res.status(500).json(new ApiError(500,error,"couldn't delete"))
        
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}