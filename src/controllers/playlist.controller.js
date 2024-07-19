import mongoose, {isValidObjectId} from "mongoose"
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
    const playlist= await PlayList.findById(playlistId);
    if(!playlist){throw new ApiError(405,"Play list not found")};

    const video= await Video.findById(videoId);
    if(!video){throw new ApiError(405,"video not found")};


    playlist.videos.push(video._id);
    await playlist.save({validateBeforeSave:false});

    res.status(200).json(new ApiResponse(200,"succesfully added"))
    
    
})

const removeVideoFromPlaylist = asynchadnler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    const playlist= await PlayList.findById(playlistId);
    if(!playlist){throw new ApiError(405,"Play list not found")};

    let index;
    for (const key in playlist.videos) {
        if (playlist.videos[key]===videoId) {
            index=key;           
        }  
    }
    console.log(index);

    if (index === -1) {
            throw new ApiError(404, "Video not found in playlist");
        }

    console.log(index);
    playlist.videos.splice(index, 1);

    await playlist.save({validateBeforeSave:false});

    res.status(200).json(new ApiResponse(200,"Deleted successfully"))

})

const deletePlaylist = asynchadnler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asynchadnler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
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