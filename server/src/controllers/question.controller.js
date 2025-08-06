import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";


const createQuestion = asyncHandler(async (req, res) => {
    // Step 1: Extract & sanitize input
    const { quizId, questionText, options, correctOption } = req.body;

    if (!quizId) {
        throw new apiError(400, "Quiz ID is required!");
    }

    if (!questionText || !questionText.trim()) {
        throw new apiError(400, "Question text is required!");
    }

    if (options.some(opt => !opt || !opt.trim())) {
        throw new apiError(400, "Each option is required!");
    }

    if (!Array.isArray(options) || options.length < 4) {
        throw new apiError(400, "Options must be an array with at least 4 items.");
    }

    if (!correctOption || !['A', 'B', 'C', 'D'].includes(correctOption)) {
        throw new apiError(400, "Correct option must be one of A, B, C, D.");
    }

    // Step 2: Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    // Step 3: Check ownership
    if (quiz.createdBy.toString() !== req.user?._id.toString()) {
        throw new apiError(403, "You are not authorized to add questions to this quiz.");
    }

    // Step 4: Create question
    const question = await Question.create({
        quizId,
        questionText: questionText.trim(),
        options,
        correctOption
    });

    // Step 5: Link question to quiz
    quiz.questions.push(question._id);
    await quiz.save();

    // Optional logging
    console.log(`Question ${question._id} created and added to Quiz ${quizId} by User ${req.user._id}`);

    // Step 6: Send response
    return res.status(201).json(
        new apiResponse(201, question, "Question created and linked to quiz successfully!")
    );
});


/************************************************************************************************************************************/

const getAllQuestions = asyncHandler(async (req, res) => {
    // Step 1: Extract & sanitize input
    const { keyword = "" } = req.query;
    const searchKeyword = keyword.trim();

    // Step 2: Build query
    let query = {};

    if (searchKeyword) {
        const regex = new RegExp(searchKeyword, "i"); // case-insensitive
        query = {
            $or: [
                { questionText: { $regex: regex } },
                { options: { $elemMatch: { $regex: regex } } }
            ]
        };
    }

    // Step 3: Fetch from DB
    const questions = await Question.find(query)
        .sort({ createdAt: -1 })
        .lean();

    // Optional logging
    console.log(`User ${req.user?._id} fetched questions with keyword: "${searchKeyword}"`);

    // Step 4: Send response
    return res.status(200).json(
        new apiResponse(200, questions, "Questions fetched successfully!")
    );
});


/************************************************************************************************************************************/

const getQuestionById = asyncHandler(async (req, res) => {
    // Step 1: Extract input
    const { questionId } = req.params;
    if (!questionId) {
        throw new apiError(400, "Question ID is required.");
    }

    // Step 2: Find question
    const question = await Question.findById(questionId);
    if (!question) {
        throw new apiError(404, "Question not found.");
    }

    // Step 3: Respond
    return res.status(200).json(
        new apiResponse(200, question, "Question details fetched successfully.")
    );
});


/************************************************************************************************************************************/

const updateQuestionById = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input
    const { questionId } = req.params;
    const { questionText, options, correctOption } = req.body;

    // Step 2: Validate required fields
    if (!questionId) throw new apiError(400, "Question ID is required.");
    if (!questionText || !options || !correctOption) {
        console.log("All fields are required.")
        throw new apiError(400, "All fields are required.");
    }

    // Step 3: Validate options content
    if (!Array.isArray(options) || options.length < 4 || options.some(opt => !opt.trim())) {
        throw new apiError(400, "Options must have at least 4 non-empty choices.");
    }

    // Step 4: Find question and its quiz
    const question = await Question.findById(questionId);
    if (!question) throw new apiError(404, "Question not found.");

    const quiz = await Quiz.findById(question.quizId);
    if (!quiz) throw new apiError(404, "Quiz not found.");

    // Step 5: Owner check
    if (!quiz.createdBy.equals(req.user._id)) {
        throw new apiError(403, "You are not authorized to update this question.");
    }

    // Step 6: Update
    question.questionText = questionText.trim();
    question.options = options.map(opt => opt.trim());
    question.correctOption = correctOption;

    await question.save();

    // Step 7: Respond
    return res.status(200).json(
        new apiResponse(200, question, "Question updated successfully.")
    );
});


/************************************************************************************************************************************/

const deleteQuestionById = asyncHandler(async (req, res) => {
    // Step 1: Extract input
    const { questionId } = req.params;
    if (!questionId) throw new apiError(400, "Question ID is required.");

    // Step 2: Find question and quiz
    const question = await Question.findById(questionId);
    if (!question) throw new apiError(404, "Question not found.");

    const quiz = await Quiz.findById(question.quizId);
    if (!quiz) throw new apiError(404, "Quiz not found.");

    // Step 3: Owner check
    if (!quiz.createdBy.equals(req.user._id)) {
        throw new apiError(403, "You are not authorized to delete this question.");
    }

    // Step 4: Remove question reference from quiz
    await Quiz.findByIdAndUpdate(
        quiz._id,
        { $pull: { questions: question._id } },
        { new: true }
    );

    // Step 5: Delete question
    await question.deleteOne();

    // Step 6: Respond
    return res.status(200).json(
        new apiResponse(200, null, "Question deleted successfully.")
    );
});


/************************************************************************************************************************************/

const getQuestionsByQuizId = asyncHandler(async (req, res) => {
    // Step 1: Extract input
    const { quizId } = req.params;
    if (!quizId) throw new apiError(400, "Quiz ID is required.");

    // Step 2: Find quiz (optional to verify existence)
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new apiError(404, "Quiz not found.");

    // Step 3: Find questions linked to this quiz
    const questions = await Question.find({ quizId });

    // Step 4: Respond
    return res.status(200).json(
        new apiResponse(200, questions, "Questions fetched successfully.")
    );
});

export {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById,
    getQuestionsByQuizId
};