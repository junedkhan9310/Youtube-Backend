import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"//to encrypt passeord we'll use prehook to encrypt


const userSchema= new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //index se search karne me easy hota
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String, //url ayega cloudinary ka usko store karege
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'password is required'], //in [] it's custom error message
    },
    refreshTokens:{
        type:String,
    }
},
    {
    timestamps:true,
    }
)

userSchema.pre("save",async function (next) {
    if(!this.isModified("password"))return next(); //checks if passord field modified or not so that it doesn't run everytime you update something

    this.password= bcrypt.hash(this.password,8)//bcrypt.hash(naam,kitne rownds)
    next()
})

//now when exporting model we need password without hashed that user given so we'll make a seperate new method for it
userSchema.methods.ispasswordcorrect = async function
(password){
    return await bcrypt.compare(password,this.password)
};

userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("Users",userSchema)