import mongoose, { Schema } from "mongoose";

const doubtReplySchema = new Schema(
    {
        doubtId: {
            type: Schema.Types.ObjectId,
            ref: 'Doubt',
            index: true,
            required: true
        },
        repliedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            required: true
        },
        replyText: {
            type: String,
            required: true,
            trim: true
        },
        parentReplyId: {
            type: Schema.Types.ObjectId,
            ref: 'DoubtReply',
            default: null,
        },
        edited: {
            type: Boolean,
            default: false
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
)

export const DoubtReply = mongoose.model("DoubtReply", doubtReplySchema);