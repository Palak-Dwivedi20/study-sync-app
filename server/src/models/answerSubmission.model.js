import mongoose, { Schema } from "mongoose";


const answerSubmissionSchema = new Schema(
    {
        participant: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        quiz: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        selectedOption: {
            type: String, // 'A', 'B', 'C', 'D'
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const AnswerSubmission = mongoose.model("AnswerSubmission", answerSubmissionSchema);