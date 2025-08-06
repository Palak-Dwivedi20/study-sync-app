// import { AnswerSubmission } from "../models/answerSubmission.model.js";
// import { QuizResult } from "../models/quizResult.model.js";
// import { Question } from "../models/question.model.js";
import { AnswerSubmission } from "../models/answerSubmission.model.js";
import { QuizResult } from "../models/quizResult.model.js";
import { Question } from "../models/question.model.js";
import { apiError } from "../utils/apiError.js";


const registerQuizMiddleware = (quizSchema) => {
    quizSchema.pre("deleteOne", {
        document: true,
        query: false
    },
        async function (next) {
            try {
                const quizId = this._id;

                // Delete all questions of this quiz
                await Question.deleteMany({ quizId });

                // Delete all answer submissions of this quiz
                await AnswerSubmission.deleteMany({ quiz: quizId });

                // Delete all quiz results of this quiz
                await QuizResult.deleteMany({ quiz: quizId });

                console.log(`[Cascading Delete] Removed Questions, AnswerSubmissions, QuizResults for Quiz ${quizId}`);

                next();

            } catch (error) {
                console.error(`[Cascading Delete Error] Quiz: ${error.message}`);
                throw new apiError(`[Cascading Delete Error] Quiz: ${error.message}`);
            }
        });
};

export { registerQuizMiddleware };
