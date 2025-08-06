import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { OTP } from "../models/otp.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmailOTP } from "../utils/sendEmailOTP.js";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";


const generateOTPForUser = asyncHandler(async (req, res) => {

    const { userId, channel, otpType } = req.body;

    if (!userId || !channel || !otpType) {
        throw new apiError(400, "userId, channel and otpType are required!");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, "User not found!");
    }

    // ✅ Delete any existing OTP for same user & type
    await OTP.deleteMany({ userId: user?._id, otpType });

    // Generate new OTP
    const otpCode = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save new OTP
    await OTP.create({
        userId: user?._id,
        otp: otpCode,
        otpType,
        channel,
        expiry
    });

    // Send OTP via email or SMS
    if (channel === "email") {
        await sendEmailOTP({
            to: user.email,
            subject: "Your StudySync OTP Verification.",
            text: `${otpCode}`
        });
    }

    return res.status(200).json(
        new apiResponse(200, null, "OTP sent successfully!")
    );
});


/**********************************************************************************************************************************************************/

const verifyOTP = asyncHandler(async (req, res) => {
    // step-1
    const { userId, otp, otpType } = req.body;

    // step-2
    if (!userId || !otp || !otpType) {
        throw new apiError(400, "userId, otp, and otpType are required!");
    }

    // step-3
    const existingOtp = await OTP.findOne({ userId, otpType }).sort({ createdAt: -1 });

    if (!existingOtp) {
        throw new apiError(400, "Invalid or expired OTP!");
    }

    if (existingOtp.otp !== otp) {
        throw new apiError(400, "Incorrect OTP!");
    }

    if (existingOtp.expiry < Date.now()) {
        throw new apiError(400, "OTP expired!");
    }

    // step-4
    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, "User not found!");
    }

    // ✅ OTP type-specific handling
    if (otpType === "emailVerification") {
        if (user.isVerified) {
            throw new apiError(400, "User is already verified!");
        }

        user.isVerified = true;
        user.isProfileCompleted = false;
        await user.save();

        // Generate Tokens (auto-login)
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);

        const verifiedUser = await User.findById(user?._id).select("-password -refreshToken").lean();

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        };

        // ✅ Mark OTP as used
        existingOtp.used = true;
        await existingOtp.save();

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        user: {
                            ...verifiedUser, // ✅ Already plain object
                            isProfileCompleted: verifiedUser.isProfileCompleted
                        },
                        accessToken,
                        refreshToken
                    },
                    "OTP verified successfully, User logged in!"
                )
            );
    }

    else if (otpType === "passwordReset") {
        // ✅ Just verify OTP and mark it used
        existingOtp.used = true;
        await existingOtp.save();

        return res.status(200).json(
            new apiResponse(
                200,
                null,
                "OTP verified successfully, proceed to reset password."
            )
        );
    }

    else {
        throw new apiError(400, "Invalid otpType!");
    }
});

export { generateOTPForUser, verifyOTP };
