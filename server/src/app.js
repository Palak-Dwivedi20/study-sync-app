import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//routes
import userRouter from "./routes/user.routes.js";
import notesRoute from "./routes/notes.routes.js";
import quizRoute from "./routes/quiz.routes.js";
import questionRoute from "./routes/question.routes.js";
import answerSubmissionRoute from "./routes/answerSubmission.routes.js"
import quizResultRoute from "./routes/quizResult.routes.js"
import doubtRoute from "./routes/doubt.routes.js"
import doubtReplyRoute from "./routes/doubtReply.routes.js"


//router declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", notesRoute);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/questions", questionRoute);
app.use("/api/v1/answer", answerSubmissionRoute);
app.use("/api/v1/result", quizResultRoute);
app.use("/api/v1/doubt", doubtRoute);
app.use("/api/v1/reply", doubtReplyRoute);



export { app };