import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Doubt } from "../models/doubt.model.js";
import { DoubtReply } from "../models/doubtReply.model.js";

const createReply = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input
    const replyText = req.body?.replyText?.trim();
    const doubtId = req.body?.doubtId;

    if (!doubtId) {
        throw new apiError(400, "Doubt ID is required.");
    }

    if (!replyText || replyText.length === 0) {
        throw new apiError(400, "Reply text is required.");
    }

    if (replyText.length > 1000) {
        throw new apiError(400, "Reply must be under 1000 characters.");
    }

    // Step 2: Validate doubt existence
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
        throw new apiError(404, "Doubt not found.");
    }

    // Step 3: Create reply
    const reply = await DoubtReply.create({
        doubtId,
        replyText,
        repliedBy: req.user?._id
    });

    console.log(`Reply created by User ID: ${req.user?._id} for Doubt ID: ${doubtId}`);

    // Step 4: Send response
    return res.status(201).json(
        new apiResponse(201, reply, "Reply posted successfully!")
    );
});


/**************************************************************************************************************************************************/

const updateReply = asyncHandler(async (req, res) => {
    // Step 1: Extract replyId from params and new text from body
    const { replyId } = req.params;
    const replyText = req.body?.replyText?.trim();

    if (!replyId) {
        throw new apiError(400, "Reply ID is required.");
    }

    if (!replyText || replyText.length === 0) {
        throw new apiError(400, "Reply text is required.");
    }

    if (replyText.length > 1000) {
        throw new apiError(400, "Reply must be under 1000 characters.");
    }

    // Step 2: Find reply
    const reply = await DoubtReply.findById(replyId);
    if (!reply) {
        throw new apiError(404, "Reply not found.");
    }

    // Step 3: Authorization check – only author can update
    if (reply.repliedBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to update this reply.");
    }

    // Step 4: Update reply text
    reply.replyText = replyText;
    reply.edited = true;
    await reply.save();

    // Step 5: Send response
    return res.status(200).json(
        new apiResponse(200, reply, "Reply updated successfully.")
    );
});


/**************************************************************************************************************************************************/

const deleteReply = asyncHandler(async (req, res) => {
    // Step 1: Get replyId from request params
    const { replyId } = req.params;

    if (!replyId) {
        throw new apiError(400, "Reply ID is required.");
    }

    // Step 2: Find the reply
    const reply = await DoubtReply.findById(replyId);
    if (!reply) {
        throw new apiError(404, "Reply not found.");
    }

    // Step 3: Authorization – only owner or admin can delete
    const isOwner = reply.repliedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin"; // assuming `role` is in user object

    if (!isOwner && !isAdmin) {
        throw new apiError(403, "You are not authorized to delete this reply.");
    }

    // Step 4: Delete the reply
    await reply.deleteOne();

    // Step 5: Send response
    return res.status(200).json(
        new apiResponse(200, null, "Reply deleted successfully.")
    );
});


/**************************************************************************************************************************************************/

const likeReply = asyncHandler(async (req, res) => {
    // Step 1: Get replyId and userId
    const { replyId } = req.params;
    const userId = req.user._id;

    if (!replyId) {
        throw new apiError(400, "Reply ID is required.");
    }

    // Step 2: Find the reply
    const reply = await DoubtReply.findById(replyId);
    if (!reply) {
        throw new apiError(404, "Reply not found.");
    }

    // Step 3: Check if user already liked
    const alreadyLiked = reply.likes.includes(userId);

    if (alreadyLiked) {
        // Unlike
        reply.likes.pull(userId);
    } else {
        // Like
        reply.likes.push(userId);
    }

    await reply.save();

    // Step 4: Send response
    return res.status(200).json(
        new apiResponse(
            200,
            {
                liked: !alreadyLiked,
                totalLikes: reply.likes.length,
                currentUserId: userId,
            },
            alreadyLiked ? "Reply unliked successfully." : "Reply liked successfully."
        )
    );
});


/**************************************************************************************************************************************************/


export {
    createReply,
    updateReply,
    deleteReply,
    likeReply
};