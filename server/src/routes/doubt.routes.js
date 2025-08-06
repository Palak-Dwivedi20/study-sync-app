import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    createDoubt,
    getAllDoubts,
    getDoubtById,
    deleteDoubt,
    updateDoubt,
    getRepliesByDoubtId,
    addReplyToDoubt,
    getDoubtsByUser
} from "../controllers/doubt.controller.js"

const router = Router();


router.route("/create-doubt").post(verifyJWT, createDoubt);

router.route("/doubts").get(getAllDoubts);

router.route("/d/:doubtId").get(getDoubtById);

router.route("/d/:doubtId").patch(verifyJWT, updateDoubt);

router.route("/d/:doubtId").delete(verifyJWT, deleteDoubt);

router.route("/d/:doubtId/replies").post(verifyJWT, addReplyToDoubt);

router.route("/d/:doubtId/replies").get(verifyJWT, getRepliesByDoubtId);

router.route("/doubts/by-user/:userId").get(getDoubtsByUser);



export default router;