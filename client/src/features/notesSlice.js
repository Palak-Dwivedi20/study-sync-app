// src/redux/notesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance.js";
import { toast } from "react-toastify";

// -----------------------------
// THUNKS
// -----------------------------

export const fetchAllNotes = createAsyncThunk(
  "notes/fetchAllNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/notes/all-notes");
      return res.data.data; // should be: { notes: [], total: number }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notes");
    }
  }
);

export const fetchNoteById = createAsyncThunk(
  "notes/fetchNoteById",
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/notes/n/${noteId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch note");
    }
  }
);

export const fetchMyNotes = createAsyncThunk(
  "notes/fetchMyNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/notes/my/notes");
      return res.data.data.notes;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your notes");
    }
  }
);

export const uploadNotes = createAsyncThunk(
  "notes/uploadNotes",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/notes/upload-notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Note upload failed");
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (noteId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/notes/n/${noteId}`);
      toast.success("Note deleted");
      return noteId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete note");
      return rejectWithValue(err.response?.data?.message || "Failed to delete note");
    }
  }
);

export const likeNote = createAsyncThunk(
  "notes/likeNote",
  async (noteId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/notes/n/${noteId}/like`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to like note");
    }
  }
);


const initialState = {
  notesData: {
    notes: [],
    total: 0,
  },
  myNotes: [],
  selectedNote: null,
  isLoading: false,
  error: null,
};


const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearSelectedNote: (state) => {
      state.selectedNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notesData = action.payload; // now expects { notes: [], total: number }
      })
      .addCase(fetchAllNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchNoteById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedNote = action.payload;
      })
      .addCase(fetchNoteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myNotes = action.payload;
      })
      .addCase(fetchMyNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(uploadNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myNotes.push(action.payload);
        state.notesData.notes.unshift(action.payload);
        state.notesData.total += 1;
      })
      .addCase(uploadNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notesData.notes = state.notesData.notes.filter(note => note._id !== action.payload);
        state.notesData.total -= 1;
        state.myNotes = state.myNotes.filter(note => note._id !== action.payload);
      })

      .addCase(likeNote.fulfilled, (state, action) => {
        const updatedNote = action.payload;
        state.notesData.notes = state.notesData.notes.map(note =>
          note._id === updatedNote._id ? updatedNote : note
        );
        state.myNotes = state.myNotes.map(note =>
          note._id === updatedNote._id ? updatedNote : note
        );
        if (state.selectedNote?._id === updatedNote._id) {
          state.selectedNote = updatedNote;
        }
      });
  },
});

export const { clearSelectedNote } = notesSlice.actions;
export default notesSlice.reducer;
