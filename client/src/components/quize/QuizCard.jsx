import React from 'react';
import { Button } from '../ComponentImport';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { FaEye, FaPlay } from 'react-icons/fa';

function QuizCard({ quiz }) {
    const navigate = useNavigate();

    const { _id, title, description, duration, questions = [] } = quiz;

    const { user } = useSelector(state => state.auth);
    const { userSubmissionsByQuiz } = useSelector(state => state.quiz);

    const hasAttempted = !!userSubmissionsByQuiz[quiz._id?.toString()];

    const handleClick = () => {
        if (hasAttempted) {
            navigate(`/quiz/${_id}/responses`);
        } else {
            navigate(`/quiz/${_id}/instructions`);
        }
    };

    return (
        <div className="bg-zinc-900 text-white border border-gray-700 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-lg">{description}</p>
            <p className="text-md text-muted-foreground text-gray-500">
                Total Questions : {questions.length}
            </p>
            <p className="text-md text-muted-foreground text-gray-500">
                Time: {duration} min
            </p>

            <Button
                title={hasAttempted ? "View Response" : "Start Quiz"}
                className={`px-5 py-2.5 mt-2 text-white text-md flex items-center gap-2 justify-center
                    ${hasAttempted ? "bg-green-600 hover:bg-green-800" : "bg-blue-700 hover:bg-blue-900"}`}
                onClick={handleClick}
                icon={hasAttempted ? <FaEye /> : <FaPlay />}
            />
        </div>
    );
}

export default QuizCard;
