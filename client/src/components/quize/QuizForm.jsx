import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useQuiz } from "../../contexts/QuizContext";
import {
    BackButton,
    Button,
    Input,
    Textarea,
    QuestionAccordion,
    ConfirmModal
} from "../ComponentImport";
import {
    createQuiz,
    createQuestionForQuiz,
    updateQuestionForQuiz,
    deleteQuestion,
    deleteQuiz,
    fetchQuizById,
    fetchQuizQuestions,
} from "../../features/quizSlice";
import { toast } from "react-toastify";
import { useModal } from "../../contexts/ModalContext";


function QuizForm({ editMode = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { quizId: quizIdFromParams } = useParams();

    const [quizId, setQuizId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    const { openConfirmModal, confirmModalProps, isConfirmModalOpen } = useModal();
    const { loading, selectedQuiz, quizQuestions } = useSelector((state) => state.quiz);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            duration: "",
            questionText: "",
            options: ["", "", "", ""],
            correctOption: "",
        },
    });

    const watchOptions = watch("options");
    const watchDuration = watch("duration");

    const handleCreateQuiz = async (data) => {
        const { title, description, duration } = data;
        const durationNumber = Number(duration);

        if (isNaN(durationNumber) || durationNumber <= 0) {
            return toast.error("Duration must be a valid number greater than 0");
        }

        try {
            const res = await dispatch(createQuiz({ title, description, duration: durationNumber })).unwrap();

            setQuizId(res?._id);
            toast.success("Quiz created. Now add questions.");
        } catch (err) {
            toast.error(err?.message || "Failed to create quiz");
        }
    };


    const handleCreateQuestion = async () => {
        const questionText = watch("questionText");
        const options = watch("options");
        const correctOption = watch("correctOption").toUpperCase();

        if (!questionText.trim() || options.some(opt => !opt.trim())) {
            return toast.error("Fill all question fields");
        }

        if (!["A", "B", "C", "D"].includes(correctOption)) {
            return toast.error("Correct option must be A, B, C, or D");
        }

        try {
            if (editingQuestionId) {
                const updated = await dispatch(
                    updateQuestionForQuiz({
                        questionId: editingQuestionId,
                        questionText,
                        options,
                        correctOption
                    })
                ).unwrap();

                setQuestions(prev =>
                    prev.map(q => q._id === updated._id ? updated : q)
                );
                toast.success("Question updated successfully");
                setEditingQuestionId(null);
            } else {
                const res = await dispatch(
                    createQuestionForQuiz({
                        quizId,
                        questionText,
                        options,
                        correctOption
                    })
                ).unwrap();

                setQuestions(prev => [...prev, res]);
                toast.success("Question added successfully");
            }

            setValue("questionText", "");
            setValue("options", ["", "", "", ""]);
            setValue("correctOption", "");
        } catch (err) {
            toast.error(err || "Failed to process question");
        }
    };


    const handleDeleteQuestion = (questionId) => {
        openConfirmModal({
            title: "Delete Question?",
            message: "Are you sure you want to permanently delete this question?",
            onConfirm: async () => {
                try {
                    await dispatch(deleteQuestion(questionId)).unwrap();
                    setQuestions(prev => prev.filter(q => q._id !== questionId));
                    toast.success("Question deleted successfully.");
                } catch (err) {
                    toast.error(err || "Failed to delete question");
                }
            },
            onCancel: () => {
                toast.info("Deletion cancelled");
            }
        });
    };


    const handleCancelQuiz = () => {
        if (!quizId) {
            navigate("/quiz");
            return;
        }

        openConfirmModal({
            title: "Discard Quiz?",
            message: "Are you sure you want to permanently discard this quiz?",
            onConfirm: async () => {
                try {
                    await dispatch(deleteQuiz(quizId)).unwrap();
                    toast.success("Quiz discarded successfully.");
                    navigate("/quiz");
                } catch (err) {
                    toast.error(err || "Failed to discard quiz");
                }
            },
            onCancel: () => {
                toast.info("Discard action cancelled.");
            }
        });
    };


    const onSubmit = async (data) => {
        if (!quizId) {
            await handleCreateQuiz(data);
        } else {
            if (questions.length === 0) {
                toast.error("Add at least 1 question");
                return;
            }
            toast.success("Quiz saved successfully!");
            navigate("/quiz");
        }
    };


    // edit mode
    useEffect(() => {
        if (editMode && quizIdFromParams) {
            dispatch(fetchQuizById(quizIdFromParams));
            dispatch(fetchQuizQuestions(quizIdFromParams));
            setQuizId(quizIdFromParams);
        }
    }, [editMode, quizIdFromParams]);

    useEffect(() => {
        if (editMode && selectedQuiz) {
            setValue("title", selectedQuiz.title);
            setValue("description", selectedQuiz.description);
            setValue("duration", selectedQuiz.duration);
        }
    }, [selectedQuiz]);

    useEffect(() => {
        if (editMode && quizQuestions?.length) {
            setQuestions(quizQuestions);
        }
    }, [quizQuestions]);



    const onEditQuestion = (question) => {
        setValue("questionText", question.questionText);
        setValue("options", [...question.options]);
        setValue("correctOption", question.correctOption);
        setEditingQuestionId(question._id);
        toast.info("Edit mode: Now editing selected question.");
    };



    return (
        <div className="min-h-[calc(100vh-60px)] overflow-auto flex gap-5 relative w-full p-8 space-y-6">
            <div className="w-full lg:w-2/3 h-full p-8 mt-6 mx-auto border border-gray-700 rounded-lg bg-zinc-900 text-white">
                <div>
                    <BackButton
                        pathname="/quiz"
                        className="absolute left-1 lg:left-5 top-4"
                    />
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold">{editMode ? "✏️ Edit Quiz" : "📝 Create Quiz"}</h2>
                    <div className="w-full flex flex-col justify-center items-center mt-5">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 w-full">
                            {/* Quiz Creation Fields */}
                            <div>
                                <Input
                                    label="Quiz Title"
                                    type="text"
                                    placeholder="Enter quiz title"
                                    autoComplete="off"
                                    {...register("title", { required: "Title is required" })}
                                    error={errors.title?.message}
                                />
                            </div>
                            <div>
                                <Textarea
                                    label="Description"
                                    placeholder="Short description"
                                    autoComplete="off"
                                    {...register("description", { required: "Description is required" })}
                                    error={errors.description?.message}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Duration (in minutes)"
                                    type="text"
                                    placeholder="e.g. 10"
                                    autoComplete="off"
                                    {...register("duration", { required: "Duration is required" })}
                                    error={errors.duration?.message}
                                />
                            </div>

                            {/* Show question section only after quiz is created */}
                            {quizId && (
                                <div className="border border-gray-700 p-4 space-y-5 rounded-lg">
                                    <h3 className="font-medium mb-2">Add Question</h3>
                                    <div>
                                        <Input
                                            label="Question"
                                            type="text"
                                            placeholder="Enter your question"
                                            autoComplete="off"
                                            {...register("questionText", { required: "Question is required" })}
                                            error={errors.questionText?.message}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        {watchOptions.map((opt, index) => (
                                            <Input
                                                key={index}
                                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                                autoComplete="off"
                                                value={opt}
                                                onChange={e => {
                                                    const newOptions = [...watchOptions];
                                                    newOptions[index] = e.target.value;
                                                    setValue("options", newOptions);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Correct Option (A/B/C/D)"
                                            autoComplete="off"
                                            {...register("correctOption", {
                                                required: "Correct option is required",
                                                validate: val => ["A", "B", "C", "D"].includes(val.toUpperCase()) || "Must be A/B/C/D"
                                            })}
                                            error={errors.correctOption?.message}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            title={editingQuestionId ? "💾 Save Question" : "➕ Add Question"}
                                            className='px-2 py-2 mt-2 bg-blue-700 text-white font-medium hover:bg-blue-900'
                                            type="button"
                                            onClick={handleCreateQuestion}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Conditional Buttons */}
                            <div className="flex space-x-3 mt-5">
                                {!quizId ? (
                                    <Button
                                        type="submit"
                                        title={!loading ? "Create Quiz" : "Creating...."}
                                        className="px-2 py-2 bg-blue-700 text-white font-medium hover:bg-blue-900"
                                    />
                                ) : (
                                    <Button
                                        type="button"
                                        title="📅 Save & Finish"
                                        className={`px-2 py-2 text-white font-medium ${questions.length === 0
                                            ? "bg-gray-400 disabled:cursor-not-allowed"
                                            : "bg-blue-700 disabled:hover:bg-blue-900"
                                            }`}
                                        onClick={() => navigate("/quiz")}
                                        disabled={questions.length === 0}
                                    />
                                )}

                                <Button
                                    title="Cancel"
                                    className="px-2 py-2 font-medium border border-gray-600 hover:bg-zinc-800"
                                    onClick={handleCancelQuiz}
                                />
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {quizId && (
                <div className="lg:w-1/3 w-full h-full bg-zinc-900 text-white mt-6 border border-gray-700 rounded-lg">
                    <div className="text-center mb-6 p-4 bg-zinc-900 border-b-2 border-gray-700 rounded-t-lg">
                        <h3 className="font-bold text-2xl">
                            📚 Preview Questions
                        </h3>
                    </div>

                    <div className="m-3">
                        {questions.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center p-4 rounded-lg bg-zinc-800 border border-gray-700"
                            >No questions added yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {questions.map((q, i) => (
                                    <QuestionAccordion
                                        key={q._id}
                                        index={i}
                                        question={q}
                                        onEdit={onEditQuestion}
                                        onDelete={handleDeleteQuestion}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isConfirmModalOpen && <ConfirmModal {...confirmModalProps} />}
        </div>
    );
}

export default QuizForm;
