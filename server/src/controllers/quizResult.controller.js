import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { QuizResult } from "../models/quizResult.model.js";
import { Quiz } from "../models/quiz.model.js";


const getUserQuizResult = asyncHandler(async (req, res) => {
    const participantId = req.user?._id;
    const { quizId } = req.params;

    // 1. Validate input
    if (!quizId) {
        throw new apiError(400, "quizId parameter is required!");
    }

    // 2. Find user's result for this quiz
    const result = await QuizResult.findOne({
        participant: participantId,
        quiz: quizId
    }).populate("quiz", "title"); // Quiz ka title populate kare

    if (!result) {
        throw new apiError(404, "No result found for this quiz!");
    }

    // 3. Return result
    return res
        .status(200)
        .json(new apiResponse(200, result, "Your quiz result fetched successfully!"));
});


/************************************************************************************************************************************/

const getQuizLeaderboard = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const userId = req.user?._id;

    // ✅ 1. Validate input
    if (!quizId) {
        throw new apiError(400, "quizId is required!");
    }

    // ✅ 2. Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new apiError(404, "Quiz not found!");
    }

    // ✅ 3. Get all results for this quiz, sorted by score desc and timeTaken asc
    const allResults = await QuizResult.find({ quiz: quizId })
        .populate("participant", "fullName")
        .sort([
            ["score", -1],
            ["timeTaken", 1],
        ]);

    // ✅ 4. Get top 10 leaderboard
    const leaderboard = allResults.slice(0, 10);

    // ✅ 5. Find user's own result
    const userResult = allResults.find(
        (result) => result.participant._id.toString() === userId.toString()
    );

    if (!userResult) {
        throw new apiError(404, "You have not attempted this quiz yet!");
    }

    // ✅ 6. Calculate user's rank
    let betterScores = 0;
    for (const result of allResults) {
        if (result.score > userResult.score) {
            betterScores++;
        } else if (
            result.score === userResult.score &&
            result.timeTaken < userResult.timeTaken
        ) {
            betterScores++;
        } else {
            break; // stop because sorted
        }
    }
    const userRank = betterScores + 1;

    // ✅ 7. Send final response
    return res
        .status(200)
        .json(new apiResponse(200, { leaderboard, userResult, userRank }, "Quiz leaderboard with your rank"));
});


export {
    getUserQuizResult,
    getQuizLeaderboard
}
