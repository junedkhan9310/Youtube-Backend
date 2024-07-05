import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getVideoHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, Userupdateavatar, UserupdateCoverimage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,

        },
        {
            name:"coverImage",
            maxCount:1,

        }
    ]),
    registerUser)

    
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post( verifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-pasword").post(verifyJwt,changeCurrentPassword)
router.route("/Current-user").get(verifyJwt,getCurrentUser)

router.route("/update-details").patch(verifyJwt,updateAccountDetails)
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),Userupdateavatar)
router.route("/coverImage-update").patch(verifyJwt,upload.single("CoverImage"),UserupdateCoverimage)


//now for req.params
router.route("/c/:username").get(verifyJwt,getUserChannelProfile)
router.route("/history").get(verifyJwt,getVideoHistory)

export default router