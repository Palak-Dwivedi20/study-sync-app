import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../axios/axiosInstance";


// 1. Logged-in user's profile (current user)
export const fetchCurrentUserProfile = createAsyncThunk(
    'profile/fetchCurrentUserProfile',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/users/current-user');
            return res.data.data; // assuming API returns { data, message }
        } catch (error) {
            console.log(error, error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 2. Get user by username (public profile)
export const fetchUserProfileByUsername = createAsyncThunk(
    'profile/fetchUserProfileByUsername',
    async (username, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/users/p/${username}`, {
                headers: { 'Cache-Control': 'public, max-age=3600' } // Cache for 1 hour
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 3. Update profile info (fullName, username, bio, etc.)
export const updateUserDetails = createAsyncThunk(
    'profile/updateUserDetails',
    async (profileData, thunkAPI) => {
        try {
            const res = await axiosInstance.patch('/users/update-profile', profileData);
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 4. Change password
export const changePassword = createAsyncThunk(
    'profile/changePassword',
    async (passwordData, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/change-password', passwordData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 5. Update avatar
export const updateUserAvatar = createAsyncThunk(
    'profile/updateUserAvatar',
    async (avatarFile, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const res = await axiosInstance.patch('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// 6. Update cover image
export const updateUserCoverImage = createAsyncThunk(
    'profile/updateUserCoverImage',
    async (coverFile, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append('coverImage', coverFile);

            const res = await axiosInstance.patch('/users/cover-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        currentUserProfile: null,
        currentUserLoading: false,
        currentUserError: null,

        selectedUserProfile: null,
        selectedUserLoading: false,
        selectedUserError: null,

        loading: false,
        error: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.currentUserProfile = null;
            state.selectedUserProfile = null;
            state.error = null;
            state.currentUserError = null;
            state.selectedUserError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCurrentUserProfile
            .addCase(fetchCurrentUserProfile.pending, (state) => {
                state.currentUserLoading = true;
                state.currentUserError = null;
            })
            .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
                state.currentUserLoading = false;
                state.currentUserProfile = action.payload;
            })
            .addCase(fetchCurrentUserProfile.rejected, (state, action) => {
                state.currentUserLoading = false;
                state.currentUserError = action.payload;
            })

            // fetchUserProfileByUsername
            .addCase(fetchUserProfileByUsername.pending, (state) => {
                state.selectedUserLoading = true;
                state.selectedUserError = null;
            })
            .addCase(fetchUserProfileByUsername.fulfilled, (state, action) => {
                state.selectedUserLoading = false;
                state.selectedUserProfile = action.payload;
            })
            .addCase(fetchUserProfileByUsername.rejected, (state, action) => {
                state.selectedUserLoading = false;
                state.selectedUserError = action.payload;
            })

            // updateUserDetails
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUserProfile = {
                    ...state.currentUserProfile,
                    ...action.payload,
                    isProfileCompleted: true,
                };
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // changePassword
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                state.currentUserProfile = null;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateUserAvatar
            .addCase(updateUserAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentUserProfile) {
                    state.currentUserProfile.avatar = action.payload.avatar;
                }
            })
            .addCase(updateUserAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateUserCoverImage
            .addCase(updateUserCoverImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserCoverImage.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentUserProfile) {
                    state.currentUserProfile.coverImage = action.payload.coverImage;
                }
            })
            .addCase(updateUserCoverImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
