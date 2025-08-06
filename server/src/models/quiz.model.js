import mongoose, { Schema } from "mongoose";
import { registerQuizMiddleware } from "../middlewares/quiz.middleware.js";

const quizSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
            index: true,
            required: true
        },
        duration: {
            type: Number,
            required: true,
            trim: true
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            }
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

registerQuizMiddleware(quizSchema);

export const Quiz = mongoose.model("Quiz", quizSchema);