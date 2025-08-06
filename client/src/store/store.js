import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice';
import quizReducer from '../features/quizSlice'
import profileReducer from '../features/profileSlice';
import notesReducer from '../features/notesSlice';
import doubtReducer from '../features/doubtSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        quiz: quizReducer,
        profile: profileReducer,
        notes: notesReducer,
        doubt: doubtReducer,
    },
})

export default store;