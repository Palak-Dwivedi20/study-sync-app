import { AnswerSubmission } from "../models/answerSubmission.model.js";
import { apiError } from "../utils/apiError.js";

const registerQuestionMiddleware = (questionSchema) => {
    questionSchema.pre("deleteOne", {
        document: true,
        query: false
    },
        async function (next) {
            try {
                const questionId = this._id;

                // Delete all answer submissions for this question
                await AnswerSubmission.deleteMany({ question: questionId });

                console.log(`[Cascading Delete] Removed AnswerSubmissions for Question ${questionId}`);

                next();
            } catch (error) {
                console.error(`[Cascading Delete Error] Question: ${error.message}`);
                throw new apiError(400, `[Cascading Delete Error] Question: ${error.message}`);
            }
        });
};

export { registerQuestionMiddleware };
