import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserProfile,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resetPassword,
    updateCoverImage,
    updateUserAvatar,
    updateUserProfile
} from "../controllers/user.controller.js";
import { generateOTPForUser, verifyOTP } from "../controllers/otp.controller.js";
import { verifyResetPasswordToken } from "../middlewares/resetPassword.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/generate-otp").post(generateOTPForUser);

router.route("/verify-otp").post(verifyOTP);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-profile").patch(verifyJWT, updateUserProfile);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

router.route("/p/:username").get(verifyJWT, getUserProfile);

router.route("/reset-password").post(verifyResetPasswordToken, resetPassword);

export default router;