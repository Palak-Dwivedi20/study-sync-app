import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserQuizResult } from '../../features/quizSlice';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../ComponentImport';

function QuizResult() {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { quizResult, quizQuestions, loading } = useSelector((state) => state.quiz);

    useEffect(() => {
        if (quizId) {
            dispatch(getUserQuizResult(quizId));
        }
    }, [dispatch, quizId]);

    if (loading || !quizResult) {
        return <div className="p-10 text-center text-lg">Loading result...</div>;
    }

    const { score, attemptedQuestion, totalQuestion, correctAnswer, timeTaken, quiz } = quizResult;

    return (
        <div className="min-h-screen overflow-auto bg-blue-100 w-full p-10">
            <div className="max-w-xl mx-auto text-center space-y-6 bg-blue-200 p-8 rounded-2xl mt-20">
                <h2 className="text-2xl font-bold">🎉 Quiz Completed!</h2>
                <p className="text-lg">
                    Your Score : <span className="font-semibold text-green-700 px-3">{score}</span>
                </p>

                {/* Info Table */}
                <div className="bg-slate-100 p-6 rounded-xl text-left space-y-5 shadow-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Total Questions :</span>
                        <span>{totalQuestion}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Question Attempt :</span>
                        <span>{attemptedQuestion}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Correct Answers :</span>
                        <span>{correctAnswer}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Incorrect Answers :</span>
                        <span>{attemptedQuestion - correctAnswer}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Time Taken :</span>
                        <span>{timeTaken} sec</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-12 p-3">
                    <Button
                        title="🏆 View Leaderboard"
                        className="bg-blue-500 px-3 py-2 text-white hover:bg-blue-700 duration-300"
                        onClick={() => navigate(`/quiz/${quizId}/leaderboard`)}
                    />
                    <Button
                        title="🏠 Back to Quiz"
                        className="bg-blue-500 px-3 py-2 text-white hover:bg-blue-700 duration-300"
                        onClick={() => navigate("/quiz")}
                    />
                </div>
            </div>
        </div>
    );
}

export default QuizResult;
