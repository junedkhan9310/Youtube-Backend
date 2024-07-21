import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/APIError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchadnler } from "../utils/asynhandler.js"

const getVideoComments = asynchadnler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asynchadnler(async (req, res) => {
    // TODO: add a comment to a video
    //1-get video id by params and content from body 
    //2-check for every required field
    //3-entry to the db with video id content and owner from req.user we'll get from verifyJWT
    const {videoId}= req.params
    const {content}= req.body

    if(!content){throw new ApiError(404,"Content is required")}

    const comment = await Comment.create({
        content,
        video:videoId,
        owner:req.user?._id
    })
    if(!comment){throw new ApiError(508,"Comment can't generate")}

    return res.status(200).json(new ApiResponse(200,comment,"Successfully commented"))
})

const updateComment = asynchadnler(async (req, res) => {
    // TODO: update a comment
    const {commentId}= req.params;
    const {content}= req.body;
    if(!content){throw new ApiError(406,"Content of comment requires")}

    try {
        const updatedcomment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set:{
                    content:content,
                }
            },
            {
                new:true
            }
        )
        if(!updatedcomment){throw new ApiError(501,"probably comment is deleted or can't find the comment")}
        res.status(201).json(new ApiResponse(201,updatedcomment,"Comment updated"))

    } catch (error) {
        res.status(500).json(new ApiError(500,"can't comment"))
    }
})

const deleteComment = asynchadnler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}= req.params
    
    try {
        const deletedcomment= await Comment.deleteOne({_id:commentId})
        res.status(200).json(new ApiResponse(200,deleteComment,"Comment successfully deleted"))
    
    } catch (error) {
        throw new ApiError(514,error,"comment can't be deleted ")
        
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }