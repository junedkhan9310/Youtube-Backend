import mongoose, {isValidObjectId} from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchadnler } from "../utils/asynhandler.js"



const toggleVideoLike = asynchadnler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    try {
        const Alreadyliked= await Like.find(
            {
                video:videoId
            }
        )

        if(Alreadyliked.length===0){

            const like= await Like.create({
                video:videoId,
                LikedBy:req.user?._id
            })
            if(!like){throw new ApiError(501,"Error in creating entry to like db")}

            res.status(200).json(new ApiResponse(200,like,"Liked the video"))

            }

        else{
            const dislike= await Like.deleteOne({_id:Alreadyliked[0]._id})

            res.status(200).json(new ApiResponse(200,dislike,"Disliked the video"))
        
                }
    } catch (error) {
        res.status(503).json(503,error,"Couldn't Like or dislike")
    }
})

const toggleCommentLike = asynchadnler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    try {
        const Alreadyliked= await Like.find(
            {
                comment:commentId
            }
        )

        if(Alreadyliked.length===0){

            const like= await Like.create({
                comment:commentId,
                LikedBy:req.user?._id
            })
            if(!like){throw new ApiError(501,"Error in creating entry to like db")}

            res.status(200).json(new ApiResponse(200,like,"Liked the comment"))

            }

        else{
            const dislike= await Like.deleteOne({_id:Alreadyliked[0]._id})

            res.status(200).json(new ApiResponse(200,dislike,"Disliked the comment"))
        
                }
    } catch (error) {
        res.status(503).json(503,error,"Couldn't Like or dislike")
    }

})

const toggleTweetLike = asynchadnler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    try {
        const Alreadyliked= await Like.find(
            {
                tweet:tweetId
            }
        )

        if(Alreadyliked.length===0){

            const like= await Like.create({
                tweet:tweetId,
                LikedBy:req.user?._id
            })
            if(!like){throw new ApiError(501,"Error in creating entry to like db")}

            res.status(200).json(new ApiResponse(200,like,"Liked the tweet"))

            }

        else{
            const dislike= await Like.deleteOne({_id:Alreadyliked[0]._id})

            res.status(200).json(new ApiResponse(200,dislike,"Disliked the comment"))
        
                }
    } catch (error) {
        res.status(503).json(503,error,"Couldn't Like or dislike")
    }

}
)

const getLikedVideos = asynchadnler(async (req, res) => {
    //TODO: get all liked videos

    try {
        const likedvideos= await Like.find(
            {
                LikedBy:req.user._id,
                video: { $exists: true, $ne: null },
                comment: { $exists: false },
                tweet: { $exists: false }

            }
        )
        console.log(likedvideos);
        if (likedvideos.length === 0) {
            throw new ApiError(400, "Didn't liked any videos");
        }

        res.status(200).json(new ApiResponse(200,likedvideos,"Every Video Liked"))
    
    } catch (error) {
        res.status(500).json(new ApiError(500, error,"Can't find Vidoes to display "));
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}