import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";

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


export default router