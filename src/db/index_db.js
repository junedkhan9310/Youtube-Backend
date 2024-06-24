import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//we always use async and trycatch for connect to db then we handle error by throwing them
const connectDB = async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB CONNECTED!! DB Host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongoDB error connection",error);
        //here instead of throw we'll be using proccess that node give automatically
        process.exit(1)
    }
}

export default connectDB