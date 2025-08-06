import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQuizzes, getUserSubmissions } from "../../features/quizSlice";
import { useNavigate } from "react-router";
import { Loader, Button } from "../ComponentImport";
import { toast } from "react-toastify";

function AttemptedQuizList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allQuizzes, userSubmissionsByQuiz, loading } = useSelector(
    (state) => state.quiz
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzes = await dispatch(fetchAllQuizzes()).unwrap();

        for (let quiz of quizzes) {
          await dispatch(getUserSubmissions(quiz._id));
        }
      } catch (err) {
        toast.error(err || "Failed to load attempted quizzes.");
      }
    };

    fetchData();
  }, [dispatch]);

  const attemptedQuizzes = allQuizzes.filter((quiz) =>
    userSubmissionsByQuiz.hasOwnProperty(quiz._id?.toString())
  );

  if (loading) return <Loader />;

  return (
    <div className="px-8">
      {attemptedQuizzes.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">You haven't attempted any quizzes yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mt-6">
          {attemptedQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-zinc-900 text-white border border-gray-700 p-6 rounded-xl shadow-sm space-y-4"
            >
              <h2 className="text-2xl font-semibold">{quiz.title}</h2>
              <p className="text-lg">{quiz.description}</p>
              <p className="text-md text-muted-foreground text-gray-500">
                Total Questions: {quiz.questions.length}
              </p>
              <p className="text-md text-muted-foreground text-gray-500">
                Time: {quiz.duration} min
              </p>
              <p className="text-xs text-gray-500 my-2">
                Attempted on:{" "}
                {new Date(
                  userSubmissionsByQuiz[quiz._id]?.submittedAt || quiz.updatedAt
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="mt-3 flex gap-3">
                <Button
                  title="View Response"
                  onClick={() => navigate(`/quiz/${quiz._id}/responses`)}
                  className="px-3 py-2 bg-green-600 text-white text-sm hover:bg-green-800"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttemptedQuizList;
