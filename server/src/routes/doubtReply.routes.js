import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createReply,
    updateReply,
    deleteReply,
    likeReply
} from "../controllers/doubtReply.controller.js"

const router = Router();


router.route("/create-reply").post(verifyJWT, createReply);

router.route("/d/:replyId").patch(verifyJWT, updateReply);

router.route("/d/:replyId").delete(verifyJWT, deleteReply);

router.route("/d/:replyId/like").put(verifyJWT, likeReply);


export default router;