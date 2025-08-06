import mongoose, { Schema } from "mongoose";

const quizResultSchema = new Schema(
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
        score: {
            type: Number,
            required: true
        },
        attemptedQuestion: {
            type: Number,
            required: true
        },
        correctAnswer: {
            type: Number,
            required: true
        },
        totalQuestion: {
            type: Number,
            required: true
        },
        timeTaken: {
            type: Number // in seconds
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

export const QuizResult = mongoose.model("QuizResult", quizResultSchema);