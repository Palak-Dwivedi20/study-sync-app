import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
    {
        groupName: {
            type: String,
            required: true
        },
        groupIcon: {
            type: String,   //cloudinary url
            default: ""
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User" //group admin
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        pendingRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "GroupMessage"
            }
        ],
    },
    {
        timestamps: true
    }
)

export const Group = mongoose.model("Group", groupSchema);