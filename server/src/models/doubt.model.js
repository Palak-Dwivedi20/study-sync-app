import mongoose, { Schema } from "mongoose";
import { registerDoubtMiddleware } from "../middlewares/doubt.middleware.js";

const doubtSchema = new Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true
        },
        askedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true
        },
        edited: {
            type: Boolean,
            default: false
        },
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'DoubtReply'
            }
        ]
    },
    {
        timestamps: true
    }
)

registerDoubtMiddleware(doubtSchema);

export const Doubt = mongoose.model("Doubt", doubtSchema);