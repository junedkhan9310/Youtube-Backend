import mongoose, {isValidObjectId, Schema } from "mongoose"
import { PlayList } from "../models/playlist.model.js"
import { ApiError } from "../utils/APIError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchadnler } from "../utils/asynhandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asynchadnler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if((!name)){throw new ApiError(405,"Enter data")}
    if((!description)){throw new ApiError(405,"Enter description data")}

    const user = await User.findById(req.user?._id)

    if(!user){throw new ApiError(403,"Login first")}
    const playlist= await PlayList.create({
        name:name,
        description:description,
        owner:user._id
    })
    
    if(!playlist){throw new ApiError(510,"can't make playlilst")};

    return res.status(200).json(new ApiResponse(200,playlist,"playlist created"))
    
})

const getUserPlaylists = asynchadnler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    try {
        const playlistofUser= await PlayList.find(
            {
                owner:userId
            },
            {
                _id:0
            }
        )
        
        if (playlistofUser.length === 0) {
            throw new ApiError(400, "Playlist doesn't exist");
        }

        console.log(playlistofUser);
        
        res.status(200).json(new ApiResponse(200,playlistofUser,"Every playlist"))
    } catch (error) {

        res.status(500).json(new ApiError(500, error,"Can't find user or playlist"));
    }
    
})

const getPlaylistById = asynchadnler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    
    const playlist= await PlayList.findById(playlistId);
    if(!playlist){throw new ApiError(405,"Play list not found")};

    return res.status(200)
                .json(new ApiResponse(200,playlist,"Playlist Fetch successfully"))
})

const addVideoToPlaylist = asynchadnler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //1-get playlist from db
    //2-get video model from videoschema
    //3-add link of the video in pkaylist model array using push
    try {
        const playlist= await PlayList.findById(playlistId);
        if(!playlist){throw new ApiError(405,"Play list not found")};
    
        const video= await Video.findById(videoId);
        if(!video){throw new ApiError(405,"video not found")};
    
    
        playlist.videos.push(video._id);
        await playlist.save({validateBeforeSave:false});
    
        res.status(200).json(new ApiResponse(200,"succesfully added"))
    } catch (error) {
        throw new ApiError(500,"unable to upload")
    }
})

const removeVideoFromPlaylist = asynchadnler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    try {
        const playlist= await PlayList.findById(playlistId);
        if(!playlist){throw new ApiError(405,"Play list not found")};
        
        let flagge;
        for (const key in playlist.videos) {
            if (playlist.videos[key]==videoId) {
                flagge= key
            }
        }
        playlist.videos.splice(flagge,1);
        console.log(playlist);

        await playlist.save({validateBeforeSave:false})
        res.status(200).json(new ApiResponse(200,"succesfully deleted"))

    } catch (error) {
        throw new ApiError(508,"Can't delete")
    }
    
})

const deletePlaylist = asynchadnler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    
    try {
        await PlayList.deleteOne({ _id: playlistId });

        res.status(200).json(new ApiResponse(200,"Playlist successfully deleted"))

    } catch (error) {
        throw new ApiError(514,"Playlist not present ")
    }
})

const updatePlaylist = asynchadnler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    console.log(name,description);
    if(!(name||description)){throw new ApiError(301,"Name or description needed")}
    
    const playlist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description,
            }
        },
        {
            new:true
        }
    )
    return res.status(200).json(new ApiResponse(200,playlist,"Playlist successfully updated"))

})




export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}