import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getQuizLeaderboard, getUserQuizResult } from "../controllers/quizResult.controller.js";


const router = Router();


router.route("/r/:quizId/mine").get(verifyJWT, getUserQuizResult);

router.route("/r/:quizId/leaderboard").get(verifyJWT, getQuizLeaderboard);



export default router;