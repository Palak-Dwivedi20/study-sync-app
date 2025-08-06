import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllQuizzes, getUserSubmissions } from '../../features/quizSlice';
import { Button, QuizCard, Loader } from '../ComponentImport';
import { useNavigate } from 'react-router';

function QuizDashboardView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allQuizzes, loading } = useSelector(state => state.quiz);

  useEffect(() => {
    dispatch(fetchAllQuizzes());
  }, []);

  useEffect(() => {
    if (allQuizzes.length > 0) {
      allQuizzes.forEach(q => {
        dispatch(getUserSubmissions(q._id));
      });
    }
  }, [allQuizzes]);


  return (
    <div className="min-h-[calc(100vh-60px)] overflow-auto bg-black text-white w-full p-10">
      <div>
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-8">📋 Quizzes</h1>
          <div className="flex space-x-2">
            <Button
              title='+ Create New Quiz'
              className='px-2 py-2 bg-blue-700 text-white font-medium hover:bg-blue-800'
              onClick={() => navigate('/quiz/create-quiz')}
            />
          </div>
        </header>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader />
          </div>
        ) : (
          <section className='mt-8 p-5'>
            {allQuizzes?.length === 0 ? (
              <p className="text-center text-gray-500">No quizzes found.</p>
            ) : (
              <div className="grid lg:grid-cols-2 gap-10">
                {allQuizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default QuizDashboardView;
