import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Doubt } from "../models/doubt.model.js";
import { DoubtReply } from "../models/doubtReply.model.js";


const createDoubt = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input
    const description = req.body?.description?.trim();

    if (!description || description.length === 0) {
        throw new apiError(400, "Doubt question is required!");
    }

    // (Optional) Length validation (example: max 500 chars)
    if (description.length > 500) {
        throw new apiError(400, "Doubt question must be under 500 characters.");
    }

    // Step 2: Create doubt
    const doubt = await Doubt.create({
        description,
        askedBy: req.user?._id
    });

    // Optional logging
    console.log(`Doubt created by User ID: ${req.user?._id}`);

    // Step 3: Send response
    return res.status(201).json(
        new apiResponse(201, doubt, "Doubt posted successfully!")
    );
});


/**************************************************************************************************************************************************/

const getAllDoubts = asyncHandler(async (req, res) => {

    const doubts = await Doubt.find({})
        .populate("askedBy", "username")
        .populate("replies")
        .sort({ createdAt: -1 }); // latest first

    return res.status(200).json(
        new apiResponse(200, doubts, "All doubts fetched successfully!")
    );
});


/**************************************************************************************************************************************************/

const getDoubtById = asyncHandler(async (req, res) => {
    const { doubtId } = req.params;

    if (!doubtId) {
        throw new apiError(400, "Doubt ID is required!");
    }

    const doubt = await Doubt.findById(doubtId)
        .populate("askedBy", "username")
        .populate({
            path: "replies",
            populate: {
                path: "repliedBy", // assuming replies have repliedBy field
                select: "username"
            }
        });

    if (!doubt) {
        throw new apiError(404, "Doubt not found!");
    }

    return res.status(200).json(
        new apiResponse(200, doubt, "Doubt fetched successfully!")
    );
});


/**************************************************************************************************************************************************/

const deleteDoubt = asyncHandler(async (req, res) => {
    const { doubtId } = req.params;

    if (!doubtId) {
        throw new apiError(400, "Doubt ID is required!");
    }

    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
        throw new apiError(404, "Doubt not found!");
    }

    // Check if current user is the owner of the doubt
    if (doubt.askedBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this doubt!");
    }

    // Cascade delete: delete all replies linked to this doubt
    if (doubt.replies && doubt.replies.length > 0) {
        await DoubtReply.deleteMany({ _id: { $in: doubt.replies } });
    }

    await doubt.deleteOne();

    return res.status(200).json(
        new apiResponse(200, null, "Doubt deleted successfully!")
    );
});


/**************************************************************************************************************************************************/

const updateDoubt = asyncHandler(async (req, res) => {
    const { doubtId } = req.params;
    const { description } = req.body;

    if (!doubtId) {
        throw new apiError(400, "Doubt ID is required!");
    }

    if (!description) {
        throw new apiError(400, "New description is required!");
    }

    const doubt = await Doubt.findById(doubtId);

    if (!doubt) {
        throw new apiError(404, "Doubt not found!");
    }

    if (doubt.askedBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to update this doubt!");
    }

    doubt.description = description.trim();
    doubt.edited = true;

    await doubt.save();

    return res.status(200).json(
        new apiResponse(200, doubt, "Doubt updated successfully!")
    );
});


/**************************************************************************************************************************************************/

const getRepliesByDoubtId = asyncHandler(async (req, res) => {
    // Step 1: Extract doubtId from request params
    const { doubtId } = req.params;

    if (!doubtId) {
        throw new apiError(400, "Doubt ID is required.");
    }

    // Step 2: Verify that the doubt exists
    const doubtExists = await Doubt.findById(doubtId);
    if (!doubtExists) {
        throw new apiError(404, "Doubt not found.");
    }

    // Step 3: Fetch all replies for the doubt
    const replies = await DoubtReply.find({ doubtId })
        .populate("repliedBy", "fullName username avatar")
        .sort({ createdAt: -1 });

    // Step 4: Send response
    return res.status(200).json(
        new apiResponse(200, replies, "Replies fetched successfully.")
    );
});


/**************************************************************************************************************************************************/

const addReplyToDoubt = asyncHandler(async (req, res) => {
    const { doubtId } = req.params;
    const { replyText, parentReplyId } = req.body;

    if (!doubtId) {
        throw new apiError(400, "Doubt ID is required!");
    }

    if (!replyText || replyText.trim().length === 0) {
        throw new apiError(400, "Reply text is required!");
    }

    // 1️⃣ Verify that doubt exists
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
        throw new apiError(404, "Doubt not found!");
    }

    // 2️⃣ If parentReplyId provided, validate it too
    let parentReply = null;
    if (parentReplyId) {
        parentReply = await DoubtReply.findById(parentReplyId);
        if (!parentReply || parentReply.doubtId.toString() !== doubtId) {
            throw new apiError(400, "Invalid parent reply ID for this doubt.");
        }
    }

    // 3️⃣ Create the reply
    const reply = await DoubtReply.create({
        replyText: replyText.trim(),
        repliedBy: req.user._id,
        doubtId: doubt._id,
        parentReplyId: parentReplyId || null
    });

    // 4️⃣ Push reply ID to doubt (only top-level replies)
    if (!parentReplyId) {
        doubt.replies.push(reply._id);
        await doubt.save();
    }

    return res.status(201).json(
        new apiResponse(201, reply, "Reply added successfully!")
    );
});


/**************************************************************************************************************************************************/

const getDoubtsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new apiError(400, "User ID is required!");
    }

    const doubts = await Doubt.find({ askedBy: userId })
        .sort({ createdAt: -1 })
        .populate("askedBy", "username email")
        .lean();

    const formattedDoubts = doubts.map((doubt) => ({
        ...doubt,
        replyCount: doubt.replies.length
        // createdAt & updatedAt already included via timestamps
    }));

    return res.status(200).json(
        new apiResponse(200, formattedDoubts, "User's doubts fetched successfully!")
    );
});



export {
    createDoubt,
    getAllDoubts,
    getDoubtById,
    deleteDoubt,
    updateDoubt,
    getRepliesByDoubtId,
    addReplyToDoubt,
    getDoubtsByUser
};
