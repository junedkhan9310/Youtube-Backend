import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asynchadnler } from "../utils/asynhandler.js"

const toggleSubscription = asynchadnler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    try {
        const AlreadySubscriber= await Subscription.find(
            {
                channel:channelId
            }
        )
        if(AlreadySubscriber.length===0)
            {
                const subscribed = await Subscription.create({
                    subscriber:req.user?._id,
                    channel:channelId
                    })
                if(!subscribed){throw new ApiError(500,"couldn't create entry in db")}
    
                res.status(200).json(new ApiResponse(200,subscribed,"Subscribed the channel"))
        }
        else{
            const unsubscriber= await Subscription.deleteOne({_id:AlreadySubscriber[0]._id})
    
            res.status(200).json(new ApiResponse(200,unsubscriber,"Unsubscribed the Channel"))
        
                }
    } catch (error) {
        res.status(503).json(503,error,"Couldn't Subscriber or unsubscribe")
        
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchadnler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchadnler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}