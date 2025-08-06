import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getUserSubmissions, submitAnswer } from "../controllers/answerSubmission.controller.js";


const router = Router();


router.route("/submit-answer").post(verifyJWT, submitAnswer);

router.route("/s/:quizId/mine").get(verifyJWT, getUserSubmissions);


export default router;