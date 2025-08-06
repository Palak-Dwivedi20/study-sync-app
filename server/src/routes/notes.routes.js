import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { deleteNotes, getAllNotes, getNoteById, getMyNotes, likeNote, uploadNotes } from "../controllers/notes.controller.js";


const router = Router();

router.route("/upload-notes").post(
    upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]),
    verifyJWT,
    uploadNotes
);

router.route("/all-notes").get(getAllNotes);

router.route("/n/:noteId").get(getNoteById);

router.route("/my/notes").get(verifyJWT, getMyNotes);

router.route("/n/:noteId").delete(verifyJWT, deleteNotes);

router.route("/n/:noteId/like").put(verifyJWT, likeNote);

export default router;
