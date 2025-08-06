import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";
import { toast } from "react-toastify";

// 🔹 Initial state
const initialState = {
    allQuizzes: [],
    myCreatedQuizzes: [],
    selectedQuiz: null,
    quizQuestions: [],
    userAnswers: [],
    userAnswerMap: {},
    userSubmissionsByQuiz: {},

    quizResult: null,
    leaderboard: [],

    loading: false,
    error: null,
};

// 🔹 Thunks

export const fetchAllQuizzes = createAsyncThunk(
    "quiz/fetchAllQuizzes",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("/quiz/quizzes");
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch quizzes");
        }
    }
);

export const fetchQuizById = createAsyncThunk(
    "quiz/fetchQuizById",
    async (quizId, { rejectWithValue, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/quiz/q/${quizId}`);
            const quiz = res.data.data;
            dispatch(setQuizQuestions(quiz.questions));
            return quiz;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const fetchMyCreatedQuizzes = createAsyncThunk(
    "quiz/fetchMyCreatedQuizzes",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("/quiz/my/quiz");
            return res.data.data.quiz;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch your quizzes");
        }
    }
);

export const fetchQuizQuestions = createAsyncThunk(
    "quiz/fetchQuizQuestions",
    async (quizId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/quiz/q/${quizId}/questions`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch questions");
        }
    }
);

export const submitAnswer = createAsyncThunk(
    "quiz/submitAnswer",
    async ({ quizId, questionId, selectedOption }, thunkAPI) => {
        try {
            await axiosInstance.post("/answer/submit-answer", {
                quizId,
                questionId,
                selectedOption,
            });
            return { questionId, selectedOption };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to submit answer");
        }
    }
);

export const submitQuiz = createAsyncThunk(
    "quiz/submitQuiz",
    async ({ quizId, timeTaken }, thunkApi) => {
        try {
            const res = await axiosInstance.post(`/quiz/q/${quizId}/submit`, {
                timeTaken,
            });
            return res.data.data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                error.response.data.message || "Failed to submit quiz"
            );
        }
    }
);

export const getUserQuizResult = createAsyncThunk(
    "quiz/getUserQuizResult",
    async (quizId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/result/r/${quizId}/mine`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to get result");
        }
    }
);

export const getQuizLeaderboard = createAsyncThunk(
    "quiz/getQuizLeaderboard",
    async (quizId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/result/r/${quizId}/leaderboard`);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to get leaderboard");
        }
    }
);

export const createQuiz = createAsyncThunk(
    "quiz/createQuiz",
    async (payload, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/quiz/create-quiz", payload);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Quiz creation failed");
        }
    }
);

export const createQuestionForQuiz = createAsyncThunk(
    "quiz/createQuestionForQuiz",
    async ({ quizId, questionText, options, correctOption }, thunkApi) => {
        try {
            const res = await axiosInstance.post("/questions/create-question", {
                quizId,
                questionText,
                options,
                correctOption,
            });
            return res.data.data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                error?.response?.data?.message || "Failed to create question"
            );
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    "quiz/deleteQuestion",
    async (questionId, thunkApi) => {
        try {
            await axiosInstance.delete(`/questions/q/${questionId}`);
            return questionId;
        } catch (error) {
            return thunkApi.rejectWithValue(
                error?.response?.data?.message || "Failed to delete question"
            );
        }
    }
);

export const updateQuestionForQuiz = createAsyncThunk(
    "quiz/updateQuestionForQuiz",
    async ({ questionId, questionText, options, correctOption }, thunkApi) => {
        try {
            const res = await axiosInstance.patch(`/questions/q/${questionId}`, {
                questionText,
                options,
                correctOption,
            });
            return res.data.data;
        } catch (error) {
            return thunkApi.rejectWithValue(
                error?.response?.data?.message || "Failed to update question"
            );
        }
    }
);

export const addQuestionToQuiz = createAsyncThunk(
    "quiz/addQuestionToQuiz",
    async ({ quizId, questionId, questionData }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`/quiz/q/${quizId}/questions/${questionId}`, questionData);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add question");
        }
    }
);

export const removeQuestionFromQuiz = createAsyncThunk(
    "quiz/removeQuestionFromQuiz",
    async ({ quizId, questionId }, thunkAPI) => {
        try {
            await axiosInstance.delete(`/quiz/q/${quizId}/questions/${questionId}`);
            return questionId;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to remove question");
        }
    }
);

export const getUserSubmissions = createAsyncThunk(
    "quiz/getUserSubmissions",
    async (quizId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/answer/s/${quizId}/mine`);
            return res.data.data; // Array of { question, selectedOption }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch user responses");
        }
    }
);

export const deleteQuiz = createAsyncThunk(
    "quiz/deleteQuiz",
    async (quizId, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(`/quiz/q/${quizId}`);
            return res.data.message;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "Failed to delete quiz"
            );
        }
    }
);



// 🔹 Slice
const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setUserAnswer: (state, action) => {
            const { questionId, selectedOption } = action.payload;
            state.userAnswers[questionId] = selectedOption;
        },
        setQuizQuestions: (state, action) => {
            state.quizQuestions = action.payload;
        },
        resetQuizState: (state) => {
            state.selectedQuiz = null;
            state.quizQuestions = [];
            state.userAnswers = [];
            userAnswerMap = {};
            state.quizResult = null;
            state.attemptedQuizzes = [];
            userSubmissionsByQuiz = {};
            state.leaderboard = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // Fetch All Quizzes
            .addCase(fetchAllQuizzes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.allQuizzes = action.payload;
            })
            .addCase(fetchAllQuizzes.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.payload);
            })

            // Fetch Single Quiz
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.selectedQuiz = action.payload;
            })

            // Fetch My Quiz
            .addCase(fetchMyCreatedQuizzes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyCreatedQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.myCreatedQuizzes = action.payload;
            })
            .addCase(fetchMyCreatedQuizzes.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.payload);
            })

            // Fetch Questions
            .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
                state.quizQuestions = action.payload;
            })

            // Submit Answer
            .addCase(submitAnswer.fulfilled, (state, action) => {
                const { questionId, selectedOption } = action.payload;
                state.userAnswers[questionId] = selectedOption;
            })

            // Submit Quiz
            .addCase(submitQuiz.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quizResult = action.payload;
                toast.success("Quiz submitted successfully!");
            })
            .addCase(submitQuiz.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.payload);
            })

            // Get Result
            .addCase(getUserQuizResult.fulfilled, (state, action) => {
                state.quizResult = action.payload;
            })

            // Get Leaderboard
            .addCase(getQuizLeaderboard.fulfilled, (state, action) => {
                state.leaderboard = action.payload;
            })

            // Create Quiz
            .addCase(createQuiz.pending, (state) => {
                state.loading = true;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedQuiz = action.payload; // Optional
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.payload);
            })

            //Create question
            .addCase(createQuestionForQuiz.pending, (state) => {
                state.createQuestionLoading = true;
                state.createQuestionError = null;
            })
            .addCase(createQuestionForQuiz.fulfilled, (state, action) => {
                state.createQuestionLoading = false;
                state.createQuestionError = null;
                // Optionally you can store added question if needed:
                state.quizQuestions.push(action.payload);
            })
            .addCase(createQuestionForQuiz.rejected, (state, action) => {
                state.createQuestionLoading = false;
                state.createQuestionError = action.payload || "Failed to add question";
            })

            // Delete Question
            .addCase(deleteQuestion.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteQuestion.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update question
            .addCase(updateQuestionForQuiz.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateQuestionForQuiz.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateQuestionForQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Question to quiz
            .addCase(addQuestionToQuiz.fulfilled, (state, action) => {
                state.quizQuestions.push(action.payload);
            })

            // Remove Question
            .addCase(removeQuestionFromQuiz.fulfilled, (state, action) => {
                state.quizQuestions = state.quizQuestions.filter(q => q._id !== action.payload);
            })

            // Get User Submissions (for review mode)
            .addCase(getUserSubmissions.fulfilled, (state, action) => {
                if (!Array.isArray(action.payload)) return;

                const quizId = action.payload[0]?.quiz;
                if (quizId) {
                    state.userSubmissionsByQuiz[quizId] = action.payload;

                    state.userAnswers = action.payload;

                    // ✅ Optional: Update userAnswers for current quiz only
                    const answers = {};
                    action.payload.forEach(({ question, selectedOption }) => {
                        answers[question._id] = selectedOption;
                    });
                    state.userAnswerMap = answers;
                }
            })


            // quizSlice.js (inside extraReducers)

            .addCase(deleteQuiz.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteQuiz.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// 🔹 Export actions and reducer
export const { setUserAnswer, resetQuizState, setQuizQuestions } = quizSlice.actions;
export default quizSlice.reducer;
