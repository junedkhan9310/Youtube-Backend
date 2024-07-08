import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFIle:{
            type:String, //from cloudnary url
            required:true,
        },
        thumbnail:{
            type:String,//from cloundary
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,//from cloudnary
            required:true,
        },
        views:{
            type:Number,
            default:0,
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    },
    {
        timestamps:true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate) //now we can write aggregate query


export const Video = mongoose.model("Video",videoSchema)