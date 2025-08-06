import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../../features/quizSlice";
import { BackButton, Button, Loader } from "../ComponentImport";
import { toast } from "react-toastify";

function QuizDetails() {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedQuiz, isLoading, error } = useSelector((state) => state.quiz);

    useEffect(() => {
        if (quizId) dispatch(fetchQuizById(quizId));
    }, [quizId, dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handleStart = () => {
        navigate(`/quiz/${quizId}/start`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex justify-center">
            {isLoading || !selectedQuiz ? (
                <Loader />
            ) : (
                <div className="w-full max-w-4xl p-8 rounded-lg relative">


                    <h1 className="text-2xl md:text-3xl font-bold text-center">
                        Welcome to <span className="text-blue-500">StudySync</span> Quiz Portal
                    </h1>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-1">
                            {selectedQuiz.title}
                        </h2>
                        <p className="text-sm text-gray-300 mb-4">
                            {selectedQuiz.description}
                        </p>
                        <div className="flex justify-between my-5">
                            <span>Duration: {selectedQuiz.duration} Minutes </span>
                            <span>Maximum Mark: {selectedQuiz.questions.length * 2} </span>
                        </div>
                        <div className="bg-zinc-900 border border-gray-700 rounded-md p-8 space-y-4 text-sm">
                            <h3 className="font-semibold text-xl">📋 General Instructions</h3>
                            <p>Read to following instructions carefully.</p>
                            <ul className="list-decimal list-inside space-y-4 ml-5">
                                <li>The quiz having {selectedQuiz.questions.length} questions.</li>
                                <li>Each question has 4 options out of which only one is correct.</li>
                                <li>You will be awarded 2 mark for each correct answer.</li>
                                <li>No negative marking for the wrong answer.</li>
                                <li>You have to finish the quiz in {selectedQuiz.duration} minutes.</li>
                                <li>The timer will appear on top-right. Quiz will auto-submit on timeout.</li>
                                <li>You can attempt each question only once. One question will be visible at a time.</li>
                                <li>You can go to previous questions and change your answer before time ends.</li>
                                <li>Click "Save & Next" to save your answer and go to next question.</li>
                                <li>There is no negative marking for the questions that you have not attempted.</li>
                                <li>Note that ONLY Questions for which answers are saved will be considered for evalution.</li>
                            </ul>
                        </div>

                        <div className="mt-15 flex justify-between">
                            <div className="flex justify-center items-center px-2">
                                <BackButton
                                    pathname="/quiz"
                                />
                            </div>
                            <div className="bg-blue-700 font-medium px-3 py-2 rounded hover:bg-blue-900 duration-300">
                                <Button
                                    title="Start Quiz"
                                    onClick={handleStart}

                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizDetails;
