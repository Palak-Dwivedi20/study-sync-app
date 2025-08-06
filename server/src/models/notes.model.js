import mongoose, { Schema } from "mongoose";

const notesSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            index: true,
            required: true,
        },
        subject: {
            type: String,
            index: true,
            required: true // Kis subject ka note hai
        },
        description: {
            type: String,
            index: true,
            trim: true,
        },
        fileUrl: {
            type: String,   //cloudinary
            required: true,
        },
        cloudinaryId: {
            type: String,   //cloudinary
            required: true
        },
        cloudinaryType: {
            type: String,
            default: "raw"
        },
        fileType: {
            type: String,
            required: true // PDF, DOCX, PPT, etc.
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true // Ek user upload karega note
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User' // Jitne users ne like kiya
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Notes = mongoose.model("Notes", notesSchema);