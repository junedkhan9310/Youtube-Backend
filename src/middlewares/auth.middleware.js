import jwt  from "jsonwebtoken"
import { ApiError } from "../utils/APIError.js"
import { asynchadnler } from "../utils/asynhandler.js"
import { User } from "../models/user.model.js"




export const verifyJwt = asynchadnler(async(req,_,next)=>{
    try {
            const token = req.cookies?.accessToken || req.header("Autorization")?.replace("Bearer ","")//either we get this via cookie parser or user will send custome eader incase of mobile dev
        
            if(!token){throw new ApiError(401,"Unathorized Request")}
        
            const decodedTokenInfo= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) //tp check whether token is true or not
        
            const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshTokens")//now we get decode info so we take user from db via decoded id
        
            if(!user){throw new ApiError(401,"invalid access token")}
        
            req.user=user;
            next()

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid accss token")
    }
    
})