import mongoose,{Schema, model} from "mongoose";

const subcriptionSchema = new Schema({

    subscriber:{
        type:Schema.Types.ObjectId, //one who is subscirbing 
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId, //one who has channel and subscriber 
        ref:"User"
    }
},{timestamps:true})











export const Subscription = mongoose.model("Subscription",subcriptionSchema)