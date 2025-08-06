import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'react-toastify';
import { nestReplies } from '../utils/nestReplies';


// Get all doubts
export const fetchAllDoubts = createAsyncThunk(
    'doubt/fetchAllDoubts',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/doubt/doubts');
            return res.data.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load doubts');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Post a new doubt
export const postDoubt = createAsyncThunk(
    'doubt/postDoubt',
    async (description, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/doubt/create-doubt', { description });
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Get doubt by ID
export const fetchDoubtById = createAsyncThunk(
    'doubt/fetchDoubtById',
    async (doubtId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/doubt/d/${doubtId}`);
            return res.data.data;
        } catch (err) {
            toast.error('Failed to load doubt');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Get replies for a doubt
export const fetchRepliesByDoubtId = createAsyncThunk(
    'doubt/fetchRepliesByDoubtId',
    async (doubtId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/doubt/d/${doubtId}/replies`);
            return { doubtId, replies: res.data.data };
        } catch (err) {
            toast.error('Failed to load replies');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Post a reply
export const postReply = createAsyncThunk(
    'doubt/postReply',
    async ({ doubtId, replyText, parentReplyId }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`/doubt/d/${doubtId}/replies`, {
                replyText,
                ...(parentReplyId && { parentReplyId })
            });
            return { doubtId, reply: res.data.data };
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Update doubt
export const updateDoubt = createAsyncThunk(
    'doubt/updateDoubt',
    async ({ doubtId, description }, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/doubt/d/${doubtId}`, { description });
            toast.success('Doubt updated');
            return res.data.data;
        } catch (err) {
            toast.error('Failed to update doubt');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Delete doubt
export const deleteDoubt = createAsyncThunk(
    'doubt/deleteDoubt',
    async (doubtId, thunkAPI) => {
        try {
            await axiosInstance.delete(`/doubt/d/${doubtId}`);
            toast.success('Doubt deleted');
            return doubtId;
        } catch (err) {
            toast.error('Failed to delete doubt');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Get doubts by user
export const fetchDoubtsByUser = createAsyncThunk(
    'doubt/fetchDoubtsByUser',
    async (userId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/doubt/doubts/by-user/${userId}`);
            return res.data.data;
        } catch (err) {
            toast.error('Failed to load user doubts');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Update a reply
export const updateReply = createAsyncThunk(
    'doubt/updateReply',
    async ({ replyId, repliedText }, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/reply/d/${replyId}`, { repliedText });
            toast.success('Reply updated');
            return res.data.data;
        } catch (err) {
            toast.error('Failed to update reply');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Delete reply
export const deleteReply = createAsyncThunk(
    'doubt/deleteReply',
    async ({ doubtId, replyId }, thunkAPI) => {
        try {
            await axiosInstance.delete(`/reply/d/${replyId}`);
            toast.success('Reply deleted');
            return { doubtId, replyId };
        } catch (err) {
            toast.error('Failed to delete reply');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// Like/Unlike a reply
export const toggleReplyLike = createAsyncThunk(
    'doubt/toggleReplyLike',
    async ({ replyId }, thunkAPI) => {
        try {
            const res = await axiosInstance.put(`/reply/d/${replyId}/like`);
            return { replyId, ...res.data.data };
        } catch (err) {
            toast.error('Failed to like/unlike');
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);


// ====================== 📦 Slice ========================== //

const initialState = {
    allDoubts: [],
    myDoubts: [],
    selectedDoubt: null,
    repliesByDoubt: {},
    loading: false,
    error: null
};


const doubtSlice = createSlice({
    name: 'doubt',
    initialState,
    reducers: {
        clearSelectedDoubt(state) {
            state.selectedDoubt = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // fetchAllDoubts
            .addCase(fetchAllDoubts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllDoubts.fulfilled, (state, action) => {
                state.loading = false;
                state.allDoubts = action.payload;
            })
            .addCase(fetchAllDoubts.rejected, (state) => {
                state.loading = false;
            })

            // postDoubt
            .addCase(postDoubt.fulfilled, (state, action) => {
                state.allDoubts.unshift(action.payload);
            })

            // fetchDoubtById
            .addCase(fetchDoubtById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDoubtById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedDoubt = action.payload;
            })
            .addCase(fetchDoubtById.rejected, (state) => {
                state.loading = false;
            })

            // fetchRepliesByDoubtId
            .addCase(fetchRepliesByDoubtId.fulfilled, (state, action) => {
                const { doubtId, replies } = action.payload;
                state.repliesByDoubt[doubtId] = nestReplies(replies);
            })

            // postReply
            .addCase(postReply.fulfilled, (state, action) => {
                const { doubtId, reply } = action.payload;
                if (!state.repliesByDoubt[doubtId]) {
                    state.repliesByDoubt[doubtId] = [];
                }
                state.repliesByDoubt[doubtId].unshift(reply);
                state.repliesByDoubt[doubtId] = nestReplies(state.repliesByDoubt[doubtId]);
            })

            // updateDoubt
            .addCase(updateDoubt.fulfilled, (state, action) => {
                const updated = action.payload;
                state.selectedDoubt = updated;
                const index = state.allDoubts.findIndex(d => d._id === updated._id);
                if (index !== -1) state.allDoubts[index] = updated;
            })

            // deleteDoubt
            .addCase(deleteDoubt.fulfilled, (state, action) => {
                const doubtId = action.payload;
                state.allDoubts = state.allDoubts.filter(d => d._id !== doubtId);
                if (state.selectedDoubt?._id === doubtId) {
                    state.selectedDoubt = null;
                }
                delete state.repliesByDoubt[doubtId];
            })

            // fetchDoubtsByUser
            .addCase(fetchDoubtsByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDoubtsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.myDoubts = action.payload;
            })
            .addCase(fetchDoubtsByUser.rejected, (state) => {
                state.loading = false;
            })


            // updateReply
            .addCase(updateReply.fulfilled, (state, action) => {
                const updatedReply = action.payload;
                const doubtId = updatedReply.doubtId;
                const replies = state.repliesByDoubt[doubtId];
                if (replies) {
                    const index = replies.findIndex(r => r._id === updatedReply._id);
                    if (index !== -1) replies[index] = updatedReply;
                }
            })

            // deleteReply
            .addCase(deleteReply.fulfilled, (state, action) => {
                const { doubtId, replyId } = action.payload;
                const replies = state.repliesByDoubt[doubtId];
                if (replies) {
                    state.repliesByDoubt[doubtId] = replies.filter(r => r._id !== replyId);
                }
            })

            // toggleReplyLike
            .addCase(toggleReplyLike.fulfilled, (state, action) => {
                console.log(action.payload);
                const { replyId, liked, currentUserId } = action.payload;
                console.log(replyId);
                console.log(liked);
                console.log(currentUserId);

                for (const doubtId in state.repliesByDoubt) {
                    const replies = state.repliesByDoubt[doubtId];
                    const updateLike = (list) => {
                        return list.map((reply) => {
                            if (reply._id === replyId) {
                                const updatedLikes = liked
                                    ? [...reply.likes, currentUserId]
                                    : reply.likes.filter(id => id !== currentUserId);
                                return { ...reply, likes: updatedLikes };
                            } else if (reply.children?.length) {
                                return { ...reply, children: updateLike(reply.children) };
                            }
                            return reply;
                        });
                    };
                    state.repliesByDoubt[doubtId] = updateLike(replies);
                }
            });
    }
});

export const { clearSelectedDoubt } = doubtSlice.actions;
export default doubtSlice.reducer;
