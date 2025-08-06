import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // console.log("AccessToken Cookie:", token);

        if (!token) {
            throw new apiError(401, "Unauthorized request!");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // console.log("Decoded Token:", decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // console.log("Fetched User:", user);

        if (!user) {
            throw new apiError(401, "Invalid Access Token!");
        }



        // if (user.isBanned) {
        //     throw new apiError(403, "Account suspended. Contact support.");
        // }

        req.user = user;
        next();

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token!");
    }

})

export { verifyJWT }
