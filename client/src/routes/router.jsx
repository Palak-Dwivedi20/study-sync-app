import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router';

// Layouts & Route Guards
import App from '../App';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/auth page/Login';
import Signup from '../pages/auth page/Signup';
import OTPVerify from '../pages/auth page/OTPVerify';
import Dashboard from '../pages/Dashboard';
import Notes from '../pages/Notes';
import Groups from '../pages/group page/Groups';
import GroupDetail from '../pages/group page/GroupDetail';
import Doubts from '../pages/doubt page/Doubts';
import DoubtThread from '../pages/doubt page/DoubtThread';
import Profile from '../pages/profile page/Profile';
import UpdateProfile from '../pages/profile page/UpdateProfile';
import UserProfile from '../pages/profile page/UserProfile';
import Setting from '../pages/Setting';
import NotFound from '../pages/NotFound';

import QuizLayout from '../layout/QuizLayout';
import QuizDashboard from '../pages/quiz page/QuizDashboard';
import CreateQuiz from '../pages/quiz page/CreateQuiz'
import EditQuiz from '../pages/quiz page/EditQuiz';
import PartcipationPage from '../pages/quiz page/ParticipationPage'
import Result from '../pages/quiz page/Result';
import Leaderboard from '../pages/quiz page/Leaderboard';
import QuizDetailsPage from '../pages/quiz page/QuizDetailsPage';
import UserResponsePage from '../pages/quiz page/UserResponsePage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Navigate to="/?modal=login" replace />} />
                <Route path='/signup' element={<Navigate to="/?modal=signup" replace />} />
                <Route path='/verify-otp' element={<OTPVerify />} />
            </Route>

            {/* Private Routes with App Layout */}
            <Route element={<PrivateRoute />}>
                <Route path='/quiz/:quizId/start' element={<PartcipationPage />} />
                <Route element={<App />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/notes' element={<Notes />} />
                    <Route path='/groups' element={<Groups />} />
                    <Route path='/groups/:groupId' element={<GroupDetail />} />
                    <Route path='/doubts' element={<Doubts />} />
                    <Route path='/doubts/:doubtId' element={<DoubtThread />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/update-profile' element={<UpdateProfile />} />
                    <Route path='/p/:username' element={<UserProfile />} />
                    <Route path='/setting' element={<Setting />} />

                    {/* ✅ Quiz Routes - Nested inside QuizLayout */}
                    <Route path='/quiz' element={<QuizLayout />}>
                        <Route index element={<QuizDashboard />} />
                        <Route path='create-quiz' element={<CreateQuiz />} />
                        <Route path='edit/:quizId' element={<EditQuiz />} />
                        <Route path=':quizId/instructions' element={<QuizDetailsPage />} />
                    </Route>
                </Route>
                <Route path='/quiz/:quizId/result' element={<Result />} />
                <Route path='/quiz/:quizId/leaderboard' element={<Leaderboard />} />
                <Route path="/quiz/:quizId/responses" element={<UserResponsePage />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path='*' element={<NotFound />} />
        </>
    )
);

export { router };
