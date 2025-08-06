import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  fetchQuizById,
  submitAnswer,
  submitQuiz,
  getUserSubmissions,
  setQuizQuestions
} from "../../features/quizSlice";
import { Button, Loader } from "../ComponentImport";
import { toast } from "react-toastify";
import { IoSchool } from "react-icons/io5";


const ParticipateQuiz = () => {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedQuiz, quizQuestions, userAnswers } = useSelector((state) => state.quiz);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Initialize quiz
  useEffect(() => {
    dispatch(fetchQuizById(quizId));
    dispatch(getUserSubmissions(quizId));
  }, [dispatch, quizId]);



  // Set timer from quiz duration
  useEffect(() => {
    if (selectedQuiz?.duration) {
      setTimeLeft(selectedQuiz.duration * 60); // convert to seconds
    }
  }, [selectedQuiz]);



  // Timer logic
  useEffect(() => {
    if (!selectedQuiz?.duration) return;

    const totalTimeInSeconds = selectedQuiz.duration * 60;

    // Auto-submit after total time
    const timeout = setTimeout(() => {
      handleAutoSubmit();
    }, totalTimeInSeconds * 1000);

    // Countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0; // 🛑 Forcefully stop at 0
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [selectedQuiz]);




  // Restore selectedOption for current question
  useEffect(() => {
    const currentQuestion = quizQuestions[currentIndex];
    if (currentQuestion) {
      const answered = userAnswers?.[currentQuestion._id];
      setSelectedOption(answered || null);
    }
  }, [currentIndex, quizQuestions, userAnswers]);



  // Handle radio option change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };



  // Save current answer and move next or submit
  const handleSaveNext = async () => {
    const question = quizQuestions[currentIndex];

    try {
      if (selectedOption) {
        await dispatch(
          submitAnswer({
            quizId,
            questionId: question._id,
            selectedOption,
          })
        ).unwrap();
      }


      if (currentIndex === quizQuestions.length - 1) {
        const timeTaken = selectedQuiz.duration * 60 - timeLeft;

        await dispatch(submitQuiz({ quizId, timeTaken })).unwrap();

        toast.success("Quiz submitted successfully.");

        navigate(`/quiz/${quizId}/result`);

        return;
      }

      setSelectedOption(null);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      toast.error(err || "Failed to save answer");
    }
  };

  // Go to previous question
  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Submit on timeout
  const handleAutoSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      const timeTaken = selectedQuiz.duration * 60;
      await dispatch(submitQuiz({ quizId, timeTaken })).unwrap();
      toast.success("Time's up! Quiz submitted.");
      navigate(`/quiz/${quizId}/result`);
    } catch (err) {
      toast.error("Failed to auto-submit quiz.");
    }
  };

  if (!selectedQuiz || quizQuestions.length === 0) {
    return <Loader />;
  }

  const currentQuestion = quizQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-blue-100 p-6 flex flex-col justify-center items-center relative">

      <div className="bg-blue-200 flex text-center px-8 py-4 shadow-md fixed top-0 left-0 right-0">
        <div className='flex gap-1'>
          <IoSchool className='text-3xl text-gray-700' />
          <h1 className="text-2xl font-bold text-gray-700">StudySync</h1>
        </div>
        <div className="ml-20 text-center">
          {selectedQuiz.title}
        </div>
      </div>


      <div className="max-w-4xl w-full flex justify-between py-2 mb-8">
        <div className="text-sm font-medium bg-blue-200 px-4 py-2 rounded-full shadow">
          <span>📘 Question: {currentIndex + 1} / {quizQuestions.length}</span>
        </div>
        <div className="text-sm font-medium bg-blue-200 px-4 py-2 rounded-full shadow">
          ⏰ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>


      <div className="bg-blue-200 max-w-3xl w-full p-5 rounded">

        <div className="flex flex-col justify-center w-full">
          <h2 className="text-lg font-semibold mb-3">
            Q{currentIndex + 1}. {currentQuestion.questionText}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
              >
                <input
                  type="radio"
                  value={String.fromCharCode(65 + i)}
                  checked={selectedOption === String.fromCharCode(65 + i)}
                  onChange={handleOptionChange}
                />
                <span>{String.fromCharCode(65 + i)}. {opt}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center mt-10">
            <Button
              title="← Previous"
              className="bg-gray-700 text-gray-200 hover:bg-gray-900 px-3 py-2"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            />
            <Button
              title={currentIndex === quizQuestions.length - 1 ? "Submit Quiz" : "Save & Next"}
              className="bg-blue-600 text-white hover:bg-blue-800 px-3 py-2"
              onClick={handleSaveNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipateQuiz;
