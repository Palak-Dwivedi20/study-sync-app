import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { AnswerSubmission } from "../models/answerSubmission.model.js";
import { QuizResult } from "../models/quizResult.model.js";


const createQuiz = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input
    const { title, description, duration, questions } = req.body;

    // Step 2: Basic validation
    if (!title || !description || !duration) {
        throw new apiError(400, "Title, description, and duration are required!");
    }

    if (typeof duration !== "number" || duration <= 0) {
        throw new apiError(400, "Duration must be a positive number.");
    }

    if (duration > 180) {
        throw new apiError(400, "Maximum duration limit is 180 min.");
    }

    //Title length check
    if (title.length > 100) {
        throw new apiError(400, "Title must be under 100 characters.");
    }

    //Description length check
    if (description.length > 300) {
        throw new apiError(400, "Description must be under 300 characters.");
    }

    // Step 3: Create the quiz
    const quiz = await Quiz.create({
        title,
        description,
        duration,
        questions,
        createdBy: req.user?._id
    });

    // Optional logging
    console.log(`Quiz created with ID: ${quiz._id}`);

    // Step 4: Send response
    return res
        .status(201)
        .json(new apiResponse(201, quiz, "Quiz created successfully!"));
});


/************************************************************************************************************************************/

const getAllQuizzes = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input (destructuring)
    let { search = "" } = req.query;
    search = search.trim();

    // Step 2: Build filter query
    const filter = search
        ? {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }
        : {};


    // Step 3: Fetch data with sorting (latest first)
    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });

    // Optional logging
    console.log(`Fetched ${quizzes.length} quizzes with search: "${search}"`);

    // Step 4: Send response
    return res.status(200).json(
        new apiResponse(200, quizzes, "Quizzes fetched successfully!")
    );
});


/************************************************************************************************************************************/

const getQuizById = asyncHandler(async (req, res) => {
    // Step 1: Extract and sanitize input
    const { quizId } = req.params;

    if (!quizId) {
        throw new apiError(400, "Quiz ID is required!");
    }

    // Step 2: Fetch quiz by ID with populated questions
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    // Optional logging
    console.log(`Fetched quiz with ID: ${quizId}`);

    // Step 3: Send response
    return res.status(200).json(
        new apiResponse(200, quiz, "Quiz fetched successfully!")
    );
});


/************************************************************************************************************************************/

const getMyQuiz = asyncHandler(async (req, res) => {

    let quiz;

    try {
        quiz = await Quiz.find({ createdBy: req.user?._id })
            .populate("createdBy", "fullName");

    } catch (error) {
        console.error("Error fetching quiz by user:", error);
        throw new apiError(500, "Failed to fetch user's quiz.");
    }


    return res.status(200).json(
        new apiResponse(200, { total: quiz.length, quiz }, "User's quiz fetched successfully")
    );

});


/************************************************************************************************************************************/

const updateQuizById = asyncHandler(async (req, res) => {
    // Step 1: Extract & sanitize input
    const { quizId } = req.params;
    const { title, description, duration, questions } = req.body;

    if (!quizId) {
        throw new apiError(400, "Quiz ID is required!");
    }

    // Step 2: Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    // Step 3: Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to update this quiz.");
    }

    // Step 4: Update fields if provided
    if (title) quiz.title = title.trim();
    if (description) quiz.description = description.trim();
    if (typeof duration === "number" && duration > 0 && duration < 180) quiz.duration = duration;
    if (Array.isArray(questions)) quiz.questions = questions;

    // Step 5: Save
    await quiz.save();

    // Optional logging
    console.log(`Quiz with ID ${quizId} updated by user ${req.user._id}`);

    // Step 6: Send response
    return res.status(200).json(
        new apiResponse(200, quiz, "Quiz updated successfully!")
    );
});


/************************************************************************************************************************************/

const deleteQuizById = asyncHandler(async (req, res) => {
    // Step 1: Extract & sanitize input
    const { quizId } = req.params;

    if (!quizId) {
        throw new apiError(400, "Quiz ID is required!");
    }

    // Step 2: Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    // Step 3: Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this quiz.");
    }

    // Step 4: Delete quiz
    await quiz.deleteOne();

    // Optional logging
    console.log(`Quiz with ID ${quizId} deleted by user ${req.user._id}`);

    // Step 5: Send response
    return res.status(200).json(
        new apiResponse(200, null, "Quiz deleted successfully!")
    );
});


/************************************************************************************************************************************/

const addQuestionToQuiz = asyncHandler(async (req, res) => {
    // Step 1: Extract & sanitize input
    const { quizId } = req.params;
    const { questionId } = req.body;

    if (!quizId) {
        throw new apiError(400, "Quiz ID is required!");
    }

    if (!questionId) {
        throw new apiError(400, "Question ID is required!");
    }

    // Step 2: Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    // Step 3: Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to modify this quiz.");
    }

    // Step 4: Push questionId to quiz.questions
    quiz.questions.push(questionId);
    await quiz.save();

    // Optional logging
    console.log(`Question ${questionId} added to Quiz ${quizId} by User ${req.user._id}`);

    // Step 5: Send response
    return res.status(200).json(
        new apiResponse(200, quiz, "Question added to quiz successfully!")
    );
});


/************************************************************************************************************************************/

const removeQuestionFromQuiz = asyncHandler(async (req, res) => {
    // Step 1: Extract input
    const { quizId, questionId } = req.params;
    if (!quizId || !questionId) {
        throw new apiError(400, "Quiz ID and Question ID are required.");
    }

    // Step 2: Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found.");
    }

    // Step 3: Check ownership
    if (quiz.createdBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to modify this quiz.");
    }

    // Step 4: Remove question
    quiz.questions = quiz.questions.filter(
        (q) => q.toString() !== questionId
    );
    await quiz.save();

    // Step 5: Respond
    return res.status(200).json(
        new apiResponse(200, quiz, "Question removed from quiz successfully.")
    );
});


/************************************************************************************************************************************/

const submitQuiz = asyncHandler(async (req, res) => {
    const participantId = req.user?._id;
    const { quizId } = req.params;
    const { timeTaken } = req.body;


    if (!quizId) throw new apiError(400, "quizId is required!");

    // Check if quiz already submitted
    const existingResult = await QuizResult.findOne({
        participant: participantId,
        quiz: quizId
    });

    if (existingResult) {
        throw new apiError(400, "You have already submitted this quiz.");
    }

    const quiz = await Quiz.findById(quizId).select("title questions");

    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    const totalQuestion = quiz.questions?.length || 0;

    // 1. Get all answers for this user & quiz
    const submissions = await AnswerSubmission.find({
        participant: participantId,
        quiz: quizId
    });

    if (!submissions.length) {
        throw new apiError(400, "No answers submitted for this quiz!");
    }

    // 2. Fetch correct options
    const questionIds = submissions.map(s => s.question);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const correctMap = {};
    questions.forEach(q => {
        correctMap[q._id.toString()] = q.correctOption;
    });

    // 3. Compare and count correct answers
    let correctCount = 0;
    submissions.forEach(sub => {
        const correctOption = correctMap[sub.question.toString()];
        if (sub.selectedOption === correctOption) {
            correctCount++;
        }
    });

    // 4. Save result
    const result = await QuizResult.findOneAndUpdate(
        { participant: participantId, quiz: quizId },
        {
            participant: participantId,
            quiz: quizId,
            score: (correctCount * 2),
            attemptedQuestion: submissions.length,
            correctAnswer: correctCount,
            totalQuestion,
            timeTaken,
            completedAt: new Date()
        },
        { new: true, upsert: true }
    );

    return res.status(200).json(
        new apiResponse(200, result, "Quiz submitted and result saved successfully!")
    );
});



export {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    getMyQuiz,
    updateQuizById,
    deleteQuizById,
    addQuestionToQuiz,
    removeQuestionFromQuiz,
    submitQuiz
}