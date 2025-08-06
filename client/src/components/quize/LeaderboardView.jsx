import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizLeaderboard } from '../../features/quizSlice';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../ComponentImport';

function LeaderboardView() {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { leaderboard } = useSelector((state) => state.quiz);

    useEffect(() => {
        if (quizId) {
            dispatch(getQuizLeaderboard(quizId));
        }
    }, [dispatch, quizId]);

    const lb = leaderboard?.leaderboard || [];
    const userRank = leaderboard?.userRank;
    const userResult = leaderboard?.userResult;
    const userId = userResult?.participant?._id;

    return (
        <div className="min-h-screen overflow-auto bg-blue-100 w-full p-6 space-y-6">

            <div className="max-w-xl mx-auto mt-20 space-y-6">
                <h2 className="text-2xl font-bold text-center">🏆 Leaderboard</h2>

                {/* User Info */}
                {userResult && (
                    <div className="bg-green-50 px-4 py-3 rounded-xl text-center font-medium">
                        You ranked <span className="text-green-700 font-bold">#{userRank}</span> with a score of{" "}
                        <span className="text-green-700 font-bold">{userResult.score}</span> in{" "}
                        {userResult.timeTaken} sec.
                    </div>
                )}

                {/* Leaderboard List */}
                <div className="border rounded-xl shadow-sm bg-white divide-y">
                    {lb.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No leaderboard data found.</div>
                    ) : (
                        lb.map((entry, index) => {
                            const isCurrentUser = entry.participant?._id === userId;
                            const isFirst = index === 0 && isCurrentUser;
                            const isLast = index === lb.length - 1 && isCurrentUser;
                            const isOnlyUser = lb.length === 1 && isCurrentUser;

                            return (
                                <div
                                    key={entry._id}
                                    className={`flex justify-between items-center px-4 py-2
                                                ${isCurrentUser ? "font-semibold text-blue-800 bg-blue-100" : ""}
                                                ${isOnlyUser ? "rounded-xl" : ""}
                                                ${!isOnlyUser && isFirst ? "rounded-t-xl" : ""}
                                                ${!isOnlyUser && isLast ? "rounded-b-xl" : ""}
                                            `}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-medium">#{index + 1}</span>
                                        <span>{entry.participant?.fullName || "Anonymous"}</span>
                                    </div>
                                    <span>{entry.score}</span>
                                </div>
                            );
                        })
                    )}
                </div>


            </div>
            <div className='max-w-3xl mx-auto mt-20 flex justify-end items-center p-2'>
                <Button
                    title="🏠 Back to Quiz"
                    className="bg-blue-500 px-3 py-2 text-white hover:bg-blue-700 duration-300"
                    onClick={() => navigate("/quiz")}
                />
            </div>
        </div>
    );
}

export default LeaderboardView;
