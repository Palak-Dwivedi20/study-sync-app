import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addQuestionToQuiz,
    createQuiz,
    deleteQuizById,
    getAllQuizzes,
    getQuizById,
    removeQuestionFromQuiz,
    submitQuiz,
    updateQuizById,
    getMyQuiz
} from "../controllers/quiz.controller.js";
import { getQuestionsByQuizId } from "../controllers/question.controller.js";


const router = Router();

router.route("/create-quiz").post(verifyJWT, createQuiz);

router.route("/quizzes").get(getAllQuizzes);

router.route("/q/:quizId").get(getQuizById);

router.route("/my/quiz").get(verifyJWT, getMyQuiz);

router.route("/q/:quizId").patch(verifyJWT, updateQuizById);

router.route("/q/:quizId").delete(verifyJWT, deleteQuizById);

router.route("/q/:quizId/questions/:questionId").post(verifyJWT, addQuestionToQuiz);

router.route("/q/:quizId/questions/:questionId").delete(verifyJWT, removeQuestionFromQuiz);

router.route("/q/:quizId/questions").get(verifyJWT, getQuestionsByQuizId);

router.route("/q/:quizId/submit").post(verifyJWT, submitQuiz);


export default router;