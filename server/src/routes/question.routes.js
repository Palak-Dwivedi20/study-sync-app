import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createQuestion, deleteQuestionById, getAllQuestions, getQuestionById, updateQuestionById } from "../controllers/question.controller.js";

const router = Router();

router.route("/create-question").post(verifyJWT, createQuestion);

router.route("/question").get(getAllQuestions);

router.route("/q/:questionId").get(getQuestionById);

router.route("/q/:questionId").patch(verifyJWT, updateQuestionById);

router.route("/q/:questionId").delete(verifyJWT, deleteQuestionById);


export default router;