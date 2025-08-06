import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { Notes } from "../models/notes.model.js";


const uploadNotes = asyncHandler(async (req, res) => {
    // Step-1: Validate input
    const { title, subject, description, fileType } = req.body;

    if ([title, subject, description, fileType].some(field => !field?.trim())) {
        throw new apiError(400, "All fields are required!");
    }

    // Step-2: Validate file type
    const allowedFileTypes = ["pdf", "docx", "pptx"];
    const normalizedFileType = fileType.toLowerCase();

    if (!allowedFileTypes.includes(normalizedFileType)) {
        throw new apiError(400, "Unsupported file type!");
    }

    // Step-3: Validate file exists
    const notesLocalPath = req.files?.file[0]?.path;
    if (!notesLocalPath) {
        throw new apiError(400, "Notes file is required!");
    }

    // Step-4: Upload to Cloudinary
    let cloudinaryResponse;
    try {
        cloudinaryResponse = await uploadOnCloudinary(notesLocalPath, "notes");
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new apiError(500, "Error uploading file to Cloudinary");
    }

    // Step-5: Validate upload response
    if (!cloudinaryResponse?.url || !cloudinaryResponse?.public_id) {
        throw new apiError(500, "Cloudinary upload incomplete");
    }

    // Step-6: Create database record
    try {
        const notes = await Notes.create({
            title,
            subject,
            description,
            fileType: normalizedFileType,
            fileUrl: cloudinaryResponse.url,
            cloudinaryId: cloudinaryResponse.public_id,
            cloudinaryType: "raw",
            uploadedBy: req.user?._id
        });

        return res.status(201).json(
            new apiResponse(201, notes, "Notes uploaded successfully")
        );

    } catch (error) {
        // Cleanup if DB fails
        await deleteFromCloudinary(cloudinaryResponse.public_id, "raw")
            .catch(cleanupErr =>
                console.error("Cleanup failed:", cleanupErr)
            );

        console.error("Database error:", error);
        throw new apiError(500, "Error saving notes to database");
    }
});


/*********************************************************************************************************************************************************/

const deleteNotes = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const userId = req.user?._id;

    // Step-1: Find note
    const note = await Notes.findById(noteId);
    if (!note) {
        throw new apiError(404, "Note not found!");
    }

    // Step-2: Verify ownership
    if (note.uploadedBy.toString() !== userId.toString()) {
        throw new apiError(403, "Unauthorized to delete this note!");
    }

    // Step-3: Delete from Cloudinary
    try {
        await deleteFromCloudinary(
            note.cloudinaryId,
            note.cloudinaryType // Use stored resource type
        );
    } catch (err) {
        console.error("Cloudinary deletion failed:", err);
        throw new apiError(500, "Failed to delete file from Cloudinary");
    }

    // Step-4: Delete from database
    try {
        await Notes.findByIdAndDelete(noteId);
    } catch (dbErr) {
        console.error("Database deletion failed:", dbErr);
        throw new apiError(500, "Note metadata deletion failed");
    }

    return res.status(200).json(
        new apiResponse(200, null, "Note deleted successfully")
    );
});


/*********************************************************************************************************************************************************/

const getAllNotes = asyncHandler(async (req, res) => {
    const {
        search = "",
        sortBy = "createdAt",
        order = "desc"
    } = req.query;

    // Aggregation pipeline
    const aggregationPipeline = [
        {
            $lookup: {
                from: "users",
                localField: "uploadedBy",
                foreignField: "_id",
                as: "uploadedBy"
            }
        },
        { $unwind: "$uploadedBy" },

        {
            $match: {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { subject: { $regex: search, $options: "i" } }
                ]
            }
        },

        {
            $project: {
                title: 1,
                description: 1,
                subject: 1,
                fileUrl: 1,
                likes: 1,
                createdAt: 1,
                uploadedBy: {
                    fullName: 1,
                    email: 1
                }
            }
        },

        {
            $sort: {
                [sortBy]: order === "asc" ? 1 : -1
            }
        }
    ];

    try {
        const notes = await Notes.aggregate(aggregationPipeline);

        return res.status(200).json(
            new apiResponse(200, { total: notes.length, notes }, "Notes fetched successfully")
        );
    } catch (err) {
        console.error("Aggregation error:", err);
        throw new apiError(500, "Failed to fetch notes!");
    }
});


/*********************************************************************************************************************************************************/

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    if (!noteId || noteId.trim() === "") {
        throw new apiError(400, "Note ID is required!");
    }

    let note;

    try {
        note = await Notes.findById(noteId).populate("uploadedBy", "fullName email");
    } catch (error) {
        console.error("Error fetching note by ID:", error);
        throw new apiError(500, "Something went wrong while fetching the note.");
    }

    if (!note) {
        throw new apiError(404, "Note not found!");
    }

    return res.status(200).json(
        new apiResponse(200, note, "Note fetched successfully")
    );
});


/*********************************************************************************************************************************************************/

const getMyNotes = asyncHandler(async (req, res) => {

    let notes;

    try {
        notes = await Notes.find({ uploadedBy: req.user?._id })
            .populate("uploadedBy", "fullName email");

    } catch (error) {
        console.error("Error fetching notes by user:", error);
        throw new apiError(500, "Failed to fetch user's notes.");
    }


    return res.status(200).json(
        new apiResponse(200, { total: notes.length, notes }, "User's notes fetched successfully")
    );

});


/*********************************************************************************************************************************************************/

const likeNote = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { noteId } = req.params;

    if (!noteId || noteId.trim() === "") {
        throw new apiError(400, "Note ID is required!");
    }

    let note;
    let alreadyLiked;
    try {
        note = await Notes.findById(noteId);

        if (!note) {
            throw new apiError(404, "Note not found!");
        }


        alreadyLiked = note.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike
            note.likes.pull(userId);
        } else {
            // Like
            note.likes.push(userId);
        }

        await note.save();

    } catch (error) {
        console.error("Error toggling like:", error);
        if (error instanceof apiError) throw error;
        throw new apiError(500, "Something went wrong while updating like.");
    }


    return res.status(200).json(
        new apiResponse(200, {
            note,
            totalLikes: note.likes.length,
            likedByUser: !note.likes.includes(userId) ? false : true
        }, alreadyLiked ? "Note unliked successfully" : "Liked successfully")
    );

});


export {
    uploadNotes,
    deleteNotes,
    getAllNotes,
    getNoteById,
    getMyNotes,
    likeNote
};