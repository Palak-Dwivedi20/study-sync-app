import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizContextProvider = ({ children }) => {
    const [showQuizForm, setShowQuizForm] = useState(false);
    const [participate, setParticipate] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showQuizResult, setShowQuizResult] = useState(false);


    // const openModal = () => setIsModalOpen(true);
    // const closeModal = () => setIsModalOpen(false);

    const toggleQuizForm = () => {
        setShowQuizForm((prev) => !prev);
    };
    const toggleParticipate = () => {
        setParticipate((prev) => !prev);
    };
    const toggleLeaderboard = () => {
        setShowLeaderboard((prev) => !prev);
    };
    const toggleQuizResult = () => {
        setShowQuizResult((prev) => !prev);
    };

    return (
        <QuizContext.Provider
            value={{
                showQuizForm,
                participate,
                showLeaderboard,
                showQuizResult,
                toggleQuizForm,
                toggleParticipate,
                toggleLeaderboard,
                toggleQuizResult
            }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
