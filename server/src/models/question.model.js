import mongoose, { Schema } from "mongoose";
import { registerQuestionMiddleware } from "../middlewares/question.middleware.js";

const questionSchema = new Schema(
    {
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true
        },
        questionText: {
            type: String,
            required: true,
            trim: true
        },
        options: {
            type: [String],
            required: true,
            validate: [arrayLimit, 'Options must have 4 choices.']
        },
        correctOption: {
            type: String,
            enum: ['A', 'B', 'C', 'D'],
            required: true
        }
    },
    {
        timestamps: true
    }

)


function arrayLimit(val) {
    return val.length >= 4;
}


registerQuestionMiddleware(questionSchema);

export const Question = mongoose.model("Question", questionSchema);