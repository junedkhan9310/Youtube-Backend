// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"



import connectDB from "./db/index.db.js";

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("after db connection error:-",err);
        throw error
       })

    app.listen(process.env.port || 8000,()=>{
        console.log(`app is listening at ${process.env.port}`);
    })
})
.catch((error)=>{
    console.log("Bhai db connection error",error);
})

