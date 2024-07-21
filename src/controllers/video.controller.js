import mongoose, {isValidObjectId} from "mongoose"
import  { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asynchadnler } from "../utils/asynhandler.js"
import { deleteOnCloudinary, uploadOnCloudinary,VideodeleteOnCloudinary } from "../utils/cloudnary.js"


const getAllVideos = asynchadnler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asynchadnler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const user= await User.findById(req.user?._id)

    if (!(title && description)) {
        throw new ApiError(400,"Please Add Title and Description")
    }
    const ThumbnailLocalPath= req.files?.thumbnail[0]?.path;
    if(!ThumbnailLocalPath){throw new ApiError(403,"Thumbnail Required")}

    const VideoLocalpath=req.files?.videoFIle[0]?.path;
    if(!VideoLocalpath){throw new ApiError(402,"Upload Video")}

    
    const VideoCloudinary = await uploadOnCloudinary(VideoLocalpath)
    if(!VideoCloudinary){throw new ApiError(500,"Error on Uploading to cloudinary")}

    const ThumbnailonCloudinary = await uploadOnCloudinary(ThumbnailLocalPath)
    if(!ThumbnailonCloudinary){throw new ApiError(500,"Error on Uploading thumbnail to cloudinary")}

    const VideoUploaded= await Video.create({
        videoFIle:VideoCloudinary.url,
        thumbnail:ThumbnailonCloudinary.url,
        title,
        description,
        duration:VideoCloudinary.duration,
        owner:user._id,

    })
    return res.status(202).json(
        new ApiResponse(200,VideoUploaded,"Video Uploaded successfully")
    )



})

const getVideoById = asynchadnler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)
    return res.status(200).json(200,video,"This is video")
})

const updateVideo = asynchadnler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    //1-get data like title, description,thumbnail,ispublished from req.body
    //find videobyid and update

    //1-get data like title, description,thumbnail,ispublished from req.body
    const { title,description,isPublished}= req.body;
    if(!(title || description || isPublished)){throw new ApiError(200,"All Fields Required")}

    const ThumbnailLocalPath= req.files?.thumbnail[0]?.path;
    if(!ThumbnailLocalPath){throw new ApiError(400,"Upload thumbnail")}

    const video = await Video.findById(videoId)
    await deleteOnCloudinary(video.thumbnail)
    
    const thumbnail = await uploadOnCloudinary(ThumbnailLocalPath)
    if(!thumbnail.url){throw new ApiError(501,"error while uploading thumbnail on cloudinary")}



    //2-find videobyid and update
    await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail:thumbnail.url,
                title,
                description
            }
        },
        {
            new:true
        }
    )

    return res.status(200).json(new ApiResponse(200,Video,"Updated VIdeos details"))


})


const deleteVideo = asynchadnler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    // console.log(videoId);
    //1-search for video from video id
    //2-delet video id from cloudinary 
    //3-delete tumbnail aslo from cloudinary
    //4-then delete the entry of entire thing using deleteOne
 
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
    
        const message = await VideodeleteOnCloudinary(video.videoFIle);
        
        if (message=="") {
            throw new ApiError(502, "Error while deleting the video");
        } else {
            await deleteOnCloudinary(video.thumbnail);
            await Video.deleteOne({ _id: video._id });
        }
        res.status(200).json(new ApiResponse(200,message,"succesfully deleted"))
    } catch (error) {
        console.error("Error details:", error);
        throw new ApiError(500, "Error deleting the video: " + error.message);
    }
    

})

const togglePublishStatus = asynchadnler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}