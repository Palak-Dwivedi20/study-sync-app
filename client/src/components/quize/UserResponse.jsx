import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { getUserSubmissions } from "../../features/quizSlice";
import { Button } from "../ComponentImport";
import { toast } from "react-toastify";

const UserResponse = () => {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userAnswers, selectedQuiz } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(getUserSubmissions(quizId))
      .unwrap()
      .catch((err) => {
        toast.error(err || "Failed to load your responses");
      });
  }, [dispatch, quizId]);


  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📝 Your Responses</h1>
          <Button
            title="View Leaderboard"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate(`/quiz/${quizId}/leaderboard`)}
          />
        </div>

        {userAnswers.length === 0 ? (
          <p className="text-gray-500">No submissions found.</p>
        ) : (
          userAnswers.map((submission, index) => {
            const { question, selectedOption } = submission;
            return (
              <div
                key={question._id}
                className="bg-white p-5 rounded shadow space-y-3 border-l-4 border-blue-400"
              >
                <h2 className="font-semibold text-gray-700">
                  Q{index + 1}. {question.questionText}
                </h2>

                <div className="space-y-2">
                  {question.options.map((opt, idx) => {
                    const optionCode = String.fromCharCode(65 + idx);
                    const isCorrect = optionCode === question.correctOption;
                    const isWrong = optionCode === selectedOption && !isCorrect;

                    return (
                      <div
                        key={idx}
                        className={`
                          px-4 py-2 rounded 
                          border 
                          ${isCorrect
                            ? "bg-green-100 border-green-400"
                            : isWrong
                              ? "bg-red-100 border-red-400"
                              : "bg-gray-50 border-gray-200"
                          }
                        `}
                      >
                        <span className="font-medium mr-2">{optionCode}.</span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <p className="text-sm text-gray-500">
                  Your Answer:{" "}
                  <span className="font-medium">
                    {selectedOption ? selectedOption : "Not Attempted"}
                  </span>
                </p>
              </div>
            );
          })
        )}
      </div>
      <div className="flex justify-center max-w-4xl w-full mx-auto mt-5 py-3">
        <Button
          title="← Back to Quiz"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/quiz")}
        />
      </div>
    </div>
  );
};

export default UserResponse;
