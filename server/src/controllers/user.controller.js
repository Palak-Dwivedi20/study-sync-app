import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { OTP } from "../models/otp.model.js";
import { options } from "../utils/cookieOptions.js";
import jwt from "jsonwebtoken";


const registerUser = asyncHandler(async (req, res) => {

    // step-1
    console.log(req.body);
    const { fullName, email, username, password } = req.body;

    // step-2
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required!");
    }

    // step-3
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new apiError(409, "User with email or username already exists!");
    }

    // step-4
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        isVerified: false
    });

    // step-5
    const createdUser = await User.findById(user?._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new apiError(500, "User Registration Failed!");
    }

    // step-6
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully! Please verify OTP.")
    );

});


/**********************************************************************************************************************************************************/

const loginUser = asyncHandler(async (req, res) => {

    // step-1
    const { email, username, password } = req.body;

    // step-2
    if (!username && !email) {
        throw new apiError(400, "username or email is required!");
    }

    // step-3
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(400, "User does not exist!");
    }

    if (!user.isVerified) {
        throw new apiError(403, "Please verify your account first!");
    }

    // step-4
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(400, "Invalid user credentials!");
    }

    // step-5
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // step-6
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // const options = {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict"
    // }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully!"
            )
        )
})


/**********************************************************************************************************************************************************/

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "Logout successful!"))
})


/**********************************************************************************************************************************************************/

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request!");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new apiError(401, "Invalid refresh token!");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used!");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        console.log("newRefreshToken = ", refreshToken);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new apiResponse(200, { accessToken, refreshToken }, "Access token refreshed!"))

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token!");
    }

})


/**********************************************************************************************************************************************************/

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isCorrectPassword = await user.isPasswordCorrect(oldPassword);

    if (!isCorrectPassword) {
        throw new apiError(400, "Invalid old password!");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new apiResponse(200, {}, "Password Changed Successfully!"));
})


/**********************************************************************************************************************************************************/

const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new apiError(401, "User not authenticated");
    }

    // console.log("Authenticated User:", req.user);

    return res.status(200).json(
        new apiResponse(200, req.user, "Current User fetched successfully!")
    );
});


/**********************************************************************************************************************************************************/

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, username, bio } = req.body;
    // console.log(fullName);
    // console.log(email);

    if (!fullName || !email || !username || !bio) {
        throw new apiError(400, "All fields are required!");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
                username,
                bio,
                isProfileCompleted: true,
            }
        },
        { new: true }

    ).select("-password");

    return res.status(200)
        .json(new apiResponse(200, user, "Profile updated successfully!"));
})


/**********************************************************************************************************************************************************/

const updateUserAvatar = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new apiError(401, "Unauthorized: User not logged in!");
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
        throw new apiError(404, "User not found!");
    }

    const oldAvatarPublic_id = currentUser?.avatarPublicId;


    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is missing!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");

    if (!avatar?.url || !avatar?.public_id) {
        throw new apiError(400, "Error while updating avatar!");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
                avatarPublicId: avatar.public_id,
                cloudinaryType: "image"
            }
        },
        { new: true }

    ).select("-password");

    //delete old avatar

    if (oldAvatarPublic_id) {
        await deleteFromCloudinary(oldAvatarPublic_id, "image")
            .catch(cleanupErr =>
                console.error("Cleanup failed for avatar:", cleanupErr)
            );
    }

    return res.status(200)
        .json(new apiResponse(200, user, "Avatar Updated Successfully!"));

})


/**********************************************************************************************************************************************************/

const updateCoverImage = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new apiError(401, "Unauthorized: User not logged in!");
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
        throw new apiError(404, "User not found!");
    }

    const oldCoverImagePublic_id = currentUser?.coverImagePublicId;


    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new apiError(400, "Cover Image is missing!");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImage");

    if (!coverImage.url) {
        throw new apiError(400, "Error while updating cover image!");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
                coverImagePublicId: coverImage.public_id,
                cloudinaryType: "image"
            }
        },
        { new: true }

    ).select("-password");


    //delete old avatar
    if (oldCoverImagePublic_id) {
        await deleteFromCloudinary(oldCoverImagePublic_id, "image")
            .catch(cleanupErr =>
                console.error("Cleanup failed for cover image:", cleanupErr)
            );
    }

    return res.status(200)
        .json(new apiResponse(200, user, "Cover Image Updated Successfully!"));

})


/**********************************************************************************************************************************************************/

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new apiError(400, "Username is missing!");
    }

    const loggedInUserId = req.user?._id;

    const userProfile = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "groups",
                localField: "joinedGroups",
                foreignField: "_id",
                as: "joinedGroupDetails"
            }
        },
        {
            $addFields: {
                groupJoinedToCount: { $size: "$joinedGroups" },
                hasCommonGroup: {
                    $anyElementTrue: {
                        $map: {
                            input: "$joinedGroups",
                            as: "groupId",
                            in: { $in: ["$$groupId", req.user.joinedGroups] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                role: 1,
                groupJoinedToCount: 1,
                hasCommonGroup: 1,
                joinedGroupDetails: {
                    _id: 1,
                    groupName: 1,
                    groupIcon: 1
                }
            }
        }
    ]);

    if (!userProfile.length) {
        throw new apiError(404, "Profile does not exist!");
    }

    return res
        .status(200)
        .json(new apiResponse(200, userProfile[0], "User profile fetched successfully!"));
});


/**********************************************************************************************************************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.resetUserId;

    if (!newPassword) {
        throw new apiError(400, "New password is required!");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, "User not found!");
    }

    // ✅ Check if OTP of type 'passwordReset' was verified (used = true)
    const usedOtp = await OTP.findOne({
        userId,
        otpType: "passwordReset",
        used: true
    }).sort({ createdAt: -1 });

    if (!usedOtp) {
        throw new apiError(403, "Password reset not authorized. Please verify OTP first.");
    }

    // ✅ Update password
    user.password = newPassword;
    await user.save();

    // ✅ Optional: Invalidate the used OTP
    await OTP.deleteMany({ userId, otpType: "passwordReset" });

    return res.status(200).json(
        new apiResponse(200, null, "Password has been reset successfully!")
    );
});



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserProfile,
    updateUserAvatar,
    updateCoverImage,
    getUserProfile,
};