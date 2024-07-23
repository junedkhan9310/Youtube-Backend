import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchadnler } from "../utils/asynhandler.js";

const healthcheck = asynchadnler(async (req, res) => {

    res.status(200).json(new ApiResponse(200,"Healthcheck passed"));
});

export {
    healthcheck
};
