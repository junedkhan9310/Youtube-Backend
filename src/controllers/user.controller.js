import { asynchadnler } from "../utils/asynhandler.js";

const registerUser = asynchadnler( async(req,res)=>{
    res.status(200).json({
        message:"chai aur code"
    })

} )


export {registerUser}