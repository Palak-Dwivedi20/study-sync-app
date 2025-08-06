import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyResetPasswordToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.resetPasswordToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new apiError(401, "Reset password token missing!");
        }

        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);

        if (decoded.purpose !== "passwordReset") {
            throw new apiError(403, "Invalid token purpose!");
        }

        req.resetUserId = decoded._id;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid or expired reset password token!");
    }
});

export { verifyResetPasswordToken };