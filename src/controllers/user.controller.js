import { asynchadnler } from "../utils/asynhandler.js";
import {ApiError} from "../utils/APIError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asynchadnler( async(req,res)=>{
    //get user detail from frontend(postman)
    //validation -atelast not empty
    //check if user already exists :from username or/and email
    //check file coverimage and avtar
    //upload them to cloudinary ,avtar
    //create user object- create entry in db
    //remove password and refresh token field from response that'll get from cloudianary
    //check for user creation 
    //return response 
    
    const {fullname,email,username,password}= req.body //user detail from body via json format or form format
    console.log("email:-",email);

    // if(fullname===""){
    //     throw new ApiError(400,"Fullname is required")
    // } we can do like this with every field or like below 
    if(
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All field are required")
    }

    //now to check if user already exists
    const existedUser= User.findOne({
        $or: [{ username },{ email }]  //$ is a operator
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    //check file coverimage and avtar
    const avtarLocalpath=req.files?.avatar[0]?.path;
    const CoverImageLocalPath= req.files?.coverImage[0]?.path;
    if(!avtarLocalpath){
        throw new ApiError(400,"avtar compulosry");
    }

    //uploading images to cloudinary
    const avatar= await uploadOnCloudinary(avtarLocalpath)
    const CoverImage = await uploadOnCloudinary(CoverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"avtar compulsory")
    }

    //now entry on database
    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: CoverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    //just checking if we actually have user in db and removing password and refresh token field from response that'll get from cloudianary
    const createdUser = await user.findById(user._id).select(
        "-password -refreshTokens"
    )
    //check for user creation
    if (!createdUser) {
        throw new ApiError(500,"something went wrong while registering user in db");
    }

    // returning response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd successfully")
    )

    
} )


export {registerUser}