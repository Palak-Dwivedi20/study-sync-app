import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new apiError(404, "User not found while generating tokens!");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // store refreshToken in database
        user.refreshToken = refreshToken;

        // save user without validation
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error in generateAccessAndRefreshTokens:", error);
        throw new apiError(500, "Something went wrong while generating access and refresh tokens!");
    }
};

export { generateAccessAndRefreshTokens };