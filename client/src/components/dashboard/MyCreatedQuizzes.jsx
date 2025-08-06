import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCreatedQuizzes, deleteQuiz, fetchQuizQuestions } from "../../features/quizSlice";
import { useNavigate } from "react-router";
import { Loader, Button, ConfirmModal, QuestionAccordion } from "../ComponentImport";
import { useModal } from "../../contexts/ModalContext";
import { toast } from "react-toastify";

function MyCreatedQuizzes() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { myCreatedQuizzes, quizQuestions, loading } = useSelector(state => state.quiz);
    const { isConfirmModalOpen, confirmModalProps, openConfirmModal } = useModal();

    const [visibleQuizId, setVisibleQuizId] = useState(null);

    useEffect(() => {
        dispatch(fetchMyCreatedQuizzes());
    }, [dispatch]);

    const handleDelete = (quizId) => {
        openConfirmModal({
            title: "Delete Quiz?",
            message: "Are you sure you want to delete this quiz permanently?",
            onConfirm: async () => {
                try {
                    await dispatch(deleteQuiz(quizId)).unwrap();
                    toast.success("Quiz deleted successfully!");
                } catch (err) {
                    toast.error(err || "Failed to delete quiz");
                }
            },
            onCancel: () => {
                toast.info("Quiz deletion cancelled.");
            }
        });
    };

    const handleViewQuestions = async (quizId) => {
        try {
            await dispatch(fetchQuizQuestions(quizId)).unwrap();
            setVisibleQuizId((prev) => (prev === quizId ? null : quizId));
        } catch (err) {
            toast.error("Failed to load questions.");
        }
    };


    const handleEditQuestion = (question) => {
        toast.info("Question edit not supported from this screen.");
    };

    const handleDeleteQuestion = (questionId) => {
        toast.info("Delete from quiz editor only.");
    };


    return (
        <div className="px-8">
            {loading ? (
                <Loader />
            ) : myCreatedQuizzes.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">No quizzes created yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mt-6">
                    {myCreatedQuizzes.map((quiz) => (
                        <div key={quiz._id} className="bg-zinc-900 text-white border border-gray-700 p-6 rounded-xl shadow-sm space-y-4">
                            <h2 className="text-2xl font-semibold">{quiz.title}</h2>
                            <p className="text-lg">{quiz.description}</p>
                            <p className="text-md text-muted-foreground text-gray-500">
                                Total Questions : {quiz.questions.length}
                            </p>
                            <p className="text-md text-muted-foreground text-gray-500">
                                Time: {quiz.duration} min
                            </p>

                            <p className="text-xs text-gray-500 my-2">
                                Created on:{" "}
                                {new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>

                            <div className="mt-3 flex gap-3">
                                <Button
                                    title="Edit Quiz"
                                    onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                                    className="px-3 py-2 bg-blue-700 text-white text-sm hover:bg-blue-800"
                                />
                                <Button
                                    title="Delete Quiz"
                                    onClick={() => handleDelete(quiz._id)}
                                    className="px-3 py-2 bg-red-600 text-white text-sm hover:bg-red-700"
                                />
                                <Button
                                    title={
                                        visibleQuizId === quiz._id ? "Hide Questions" : "View Questions"
                                    }
                                    onClick={() => handleViewQuestions(quiz._id)}
                                    className="px-3 py-2 bg-gray-700 text-white text-sm hover:bg-gray-800"
                                />
                            </div>
                            
                            {visibleQuizId === quiz._id && (
                                <div className="mt-4 space-y-3">
                                    {quizQuestions.length === 0 ? (
                                        <p className="text-sm text-gray-400">No questions found.</p>
                                    ) : (
                                        quizQuestions.map((q, i) => (
                                            <QuestionAccordion
                                                key={q._id}
                                                index={i}
                                                question={q}
                                                onEdit={handleEditQuestion}
                                                onDelete={handleDeleteQuestion}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {isConfirmModalOpen && <ConfirmModal {...confirmModalProps} />}
        </div>
    );
}

export default MyCreatedQuizzes;
