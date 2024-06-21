// require('dotenv').config({path:'./env'})
// we can use above import but it'll change consistency of our importing statement so we use this
import dotenv from "dotenv"


// import mongoose from "mongoose";
// //now connecting mongoose to the database
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB()











/* 
import express from "express"
const app = express()
(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("error:-",err);
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`app is listening of ${process.env.PORT}`);
       })



    } catch (error) {
        console.log("error",error);
        throw err
    }
})()
    */