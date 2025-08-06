import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { AnswerSubmission } from "../models/answerSubmission.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { QuizResult } from "../models/quizResult.model.js";
import mongoose from "mongoose";


const submitAnswer = asyncHandler(async (req, res) => {
    // Extract and sanitize input
    const { quizId, questionId, selectedOption } = req.body;

    if (!quizId || !questionId || !selectedOption) {
        throw new apiError(400, "quizId, questionId and selectedOption are required!");
    }

    // Prevent answer submission if quiz already submitted
    const existingResult = await QuizResult.findOne({
        participant: req.user._id,
        quiz: quizId
    });

    if (existingResult) {
        throw new apiError(400, "You have already submitted this quiz. Cannot submit more answers.");
    }

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found");
    }

    // Check if question belongs to the quiz
    const question = await Question.findById(questionId);
    if (!question) {
        throw new apiError(404, "Question not found");
    }
    if (!question.quizId.equals(quiz._id)) {
        throw new apiError(400, "This question does not belong to the given quiz");
    }

    // Option validation (A/B/C/D)
    if (!['A', 'B', 'C', 'D'].includes(selectedOption)) {
        throw new apiError(400, "Invalid selectedOption value (must be 'A', 'B', 'C', or 'D')");
    }

    // Upsert: If already answered → update answer, else create
    const submission = await AnswerSubmission.findOneAndUpdate(
        {
            participant: req.user?._id,
            quiz: quizId,
            question: questionId
        },
        {
            participant: req.user?._id,
            quiz: quizId,
            question: questionId,
            selectedOption,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Response
    return res.status(200).json(
        new apiResponse(200, submission, "Answer saved successfully!")
    );
});


/************************************************************************************************************************************/

const getUserSubmissions = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input
    const { quizId } = req.params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
        throw new apiError(400, "Valid quizId is required.");
    }

    // Step 2: Fetch submissions
    const submissions = await AnswerSubmission.find({
        participant: req.user?._id,
        quiz: quizId
    }).populate('question', 'questionText options correctOption');

    if (!submissions || submissions.length === 0) {
        return res
            .status(200)
            .json(new apiResponse(200, submissions, "No submissions found for this quiz."));
        // throw new apiError(404, "No submissions found for this quiz.");
    }

    // Step 3: Respond
    return res
        .status(200)
        .json(new apiResponse(200, submissions, "User submissions fetched successfully."));
});


export {
    submitAnswer,
    getUserSubmissions
}
