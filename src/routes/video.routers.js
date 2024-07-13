import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { publishAVideo,deleteVideo, updateVideo, getVideoById } from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/VideoPublish").post(//upload dalna baki hai user routes mese dhek
    upload.fields([
        {
            name:"videoFIle",
            maxCount:1,

        },
        {
            name:"thumbnail",
            maxCount:1,

        }
    ]),
    publishAVideo)
    
router.route("/c/:videoId").delete(deleteVideo)

router.route("/c/update/:videoId").post(
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1,
        }
    ]),
    updateVideo)

router.route("/c/getuser/:videoId").get(getVideoById)


export default router