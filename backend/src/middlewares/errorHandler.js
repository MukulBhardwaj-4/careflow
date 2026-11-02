import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = () => {
    if (err instanceof ApiError) {
        return res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, null, err.message));
    }

    console.error(err);
    return res
        .status(500)
        .json(new ApiResponse(500, null, "Internal Server Error"));
};