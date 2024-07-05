import { asynchadnler } from "../utils/asynhandler.js";
import {ApiError} from "../utils/APIError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const user= await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()//access token we give direclty to user but we also save refresh token in db
        
        user.refreshToken=refreshToken; //saving refresh token to db to user 
        await user.save({validateBeforeSave :false})//save kicks in everyting else so we add validatebeforesave to ignore required fields in models

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"problem in generating refresh and access token")
    }
}

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
    
    const {fullName,email,username,password}= req.body //user detail from body via json format or form format
    // console.log("email:-",email);

    // if(fullname===""){
    //     throw new ApiError(400,"Fullname is required")
    // } we can do like this with every field or like below 
    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All field are required")
    }

    //now to check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]  //$ is a operator
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    // console.log(req.files);

    //check file coverimage and avtar
    const avtarLocalpath=req.files?.avatar[0]?.path;
    // const CoverImageLocalPath= req.files?.coverImage[0]?.path;
    let CoverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        CoverImageLocalPath= req.files.coverImage[0].path;
    }

    
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
        fullName,
        avatar:avatar.url,
        coverImage: CoverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    // just checking if we actually have user in db and removing password and refresh token field from response that'll get from cloudianary
    const createdUser = await User.findById(user._id).select("-password -refreshTokens");
    if (!createdUser) {
        throw new ApiError(501, "Something went wrong while registering the user in the database");
    }


    // returning response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd successfully")
    )
} )

const loginUser = asynchadnler(async(req,res)=>{

    //take username and email and password from rq.body
    // match username with db and find user
    //Direclty check pasword
    //generate access and refresh tokens
    //send to user via cookies(secure cookies)

    const {email,username,password}= req.body  //taking data from req.body

    if (!(username || email)) {
        throw new ApiError(400,"Atleast one required username or email")
    }


    const user= await User.findOne({ //finding user from email or username given via body and storing in user
        $or:[{username},{email}] //$ mongodb operator
    })

    if(!user) { //if we didn't get user in db that means user doens't exists
        throw new ApiError(404,"user doens't exists")
    }

    const ispasswordvalid= await user.ispasswordcorrect(password) //returns truw or false

    if(!ispasswordvalid) { //checks if correct or incorrect
        throw new ApiError(401,"incorrect password")
    }

    //now making access and refresh tokens we'll create a method above

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);

    //now sending user in cookies
    const logedinuser= await User.findById(user._id).select("-password -refreshToken")
    
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:logedinuser,accessToken,refreshToken
            },
            "user logged in succesffully"
        )
    )
})

const logoutUser= asynchadnler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:undefined
            }
            
        },
        {
            new:true
        }
    )

    //now we clear refrshtoken cookie
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"userloggedout succesfsully"))
})

const refreshAccessToken= asynchadnler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unathorized request")
    }

    try {
        const decodedrefreshtoken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user= await User.findById(decodedrefreshtoken?._id)
    
        if(!user){
            throw new ApiError(401,"invalid refreshtoken")
        }
    
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refresh token in expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true,
        }
    
        const {newaccessToken,newrefreshToken}= await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",newaccessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(new ApiResponse(200,
                                {newaccessToken,newrefreshToken},
                                "tokens refreshed successfully"))
    
    } catch (error) {
        throw new ApiError(402,error?.message|| "invalid refresh token")
    }


})

const changeCurrentPassword= asynchadnler(async(req,res)=>{
    const {oldpasseord,newpassword}= req.body
    const user = await User.findById(req.user?._id)
    const ispasswordCorrect= await user.isispasswordcorrect(oldpasseord)

    if(!ispasswordCorrect){
        throw new ApiError(400,"invalid old password")
    }

    user.password=newpassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"password change succesfully"))

})

const getCurrentUser= asynchadnler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"currentuser fetched successfuly ")
})

const updateAccountDetails= asynchadnler(async(req,res)=>{

    const {fullName,email}= req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required")
    }

    const user= User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"updated successfully"))
})

const Userupdateavatar= asynchadnler(async(req,res)=>{
    //i want to make a util to deleted already present image in db and cloudinary
    const avtarlocalpath= req.file?.path
    if(avtarlocalpath){throw new ApiError(400,"uload file is missing")}

    const avatar = await uploadOnCloudinary(avtarlocalpath)
    if(!avatar.url){throw new ApiError(501,"error while uploading avatara on cloudinary")}

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"avatar uploaded"))

})

const UserupdateCoverimage= asynchadnler(async(req,res)=>{

    const CoverImagelocalpath= req.file?.path
    if(CoverImagelocalpath){throw new ApiError(400,"uload file is missing")}

    const CoverImage = await uploadOnCloudinary(CoverImagelocalpath)
    if(!CoverImage.url){throw new ApiError(501,"error while uploading coverimage on cloudinary")}

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:CoverImage.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200,user,"Coverimgae uploaded"))

})

const getUserChannelProfile= asynchadnler(async(req,res)=>{

    const {username}= req.params

    if(!username?.trim()){throw new ApiError(400,"user not found")} //checks if username exists or not

    const channel =await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },  
        {
            $lookup:{
                from :"subscriptions", //eveything in lower case and added s in last
                localField:"_id",
                foreignField:"channel",
                as:"subscriber"
            }
        },
        {
            $lookup:{
                from :"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscriber"
                },
                channelsSubcriberdToCount:{
                   $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{ 
                        if:{$in: [req.user?._id,"$subscriber.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }

        },
        {
            $project:{
                fullName:1,
                username:1,
                subscriberCount:1,
                channelsSubcriberdToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1,                
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(400,"Channel deosn't exists")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,channel[0],"user channel feteched"))

})





export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    Userupdateavatar,
    UserupdateCoverimage,
    getUserChannelProfile
}