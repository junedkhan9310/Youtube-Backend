import express from 'express'
import cors from "cors"//for dealing with cors policy so that we can update and track on same sevrer
import cookieParser from 'cookie-parser'; //When using cookie-parser middleware, this property is an object that contains cookies sent by the request. If the request contains no cookies, it defaults to {}.



const app= express();

//now ocnifguring cors and cookie parser
// app.use(cors())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));

app.use(express.json({limit:"16Kb"}))//this accepts json from frontend and also we can limit json file we will get and therre are other usuage also
//now to accepts data from url we need to decote url so we configure it
app.use(express.urlencoded({extended:true, limit:"16kb"}))
//we'll also add another use to accepts pdf and other format so for that we'll use static
app.use(express.static("public"))//we'll store images and other in public folder 
app.use(cookieParser())//this use for acccesing and seting cookie form user browser and to user broswer
//when we want to access a certain /admin or anyting we use middleware to assest whether the response should send or not



//routes importing
import UserRouter from './routes/user.routers.js'; 
import videorouter from './routes/video.routers.js';
import playlistRouter from './routes/playlist.routers.js'
import twitterRouter from './routes/tweet.routers.js'


//routes decalrtion
app.use("/api/v1/users",UserRouter)
//https://localhost:8000/api/v1/users/register it'll be like this

app.use("/api/v1/videos", videorouter)

app.use("/api/v1/playlist", playlistRouter)

app.use("/api/v1/twitter",twitterRouter)



export { app }