import { databases } from "@/lib/appwrite";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ID, Query } from "appwrite";

export const COURSES_DATABASE_ID = "678fc38f000034b5a490";
export const VIDEOS_COLLECTION_ID = "678fcc7d0038a49c1413";

export const getVideos = createAsyncThunk("videos/get", async (courseId, { rejectWithValue }) => {
    try {
        const response = await databases.listDocuments(
            COURSES_DATABASE_ID,
            VIDEOS_COLLECTION_ID,
            [Query.equal("course_id", courseId)]
        );
        return response;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
})

export const createVideos = createAsyncThunk("videos/post", async (videosList, { rejectWithValue }) => {
    console.log("POST /videos payload : ", videosList);

    try {
        const response = await Promise.all(
            videosList.map(video => databases.createDocument(
                COURSES_DATABASE_ID,
                VIDEOS_COLLECTION_ID,
                ID.unique(),
                video
            ))
        );
        console.log("POST /videos response : ", response);
        return response;

    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
})

export const updateVideo = createAsyncThunk("videos/put", async ({ videoId, data }, { rejectWithValue }) => {
    console.log("Received video id to update: ", videoId);

    console.log("video marking as complete with data : ", data);
    try {
        const response = await databases.updateDocument(
            COURSES_DATABASE_ID,
            VIDEOS_COLLECTION_ID,
            videoId,
            data
        );
        console.log("Update video response : ", response);

        return response;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.message);
    }
})

const initialState = {
    videos: [],
    isLoggedIn: false,
    isLoading: false,
    error: null
}

export const videoSlice = createSlice({
    name: "videos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getVideos.fulfilled, (state, action) => {
            state.videos = action.payload.documents;
            state.isLoading = false;
            state.error = null;
        }).addCase(getVideos.pending, (state) => {
            state.isLoading = true;
        }).addCase(getVideos.rejected, (state, action) => {
            state.isLoading = false;
            state.error = `An error occurred while fetching videos: ${action.payload}`
        }).addCase(createVideos.fulfilled, (state, action) => {
            state.videos = [...action.payload];
            state.isLoading = false;
            state.error = null;
        }).addCase(createVideos.pending, (state) => {
            state.isLoading = true;
        }).addCase(createVideos.rejected, (state, action) => {
            state.isLoading = false;
            state.error = `An error occurred while creating videos: ${action.payload}`
        }).addCase(updateVideo.fulfilled, (state, action) => {
            console.log(action.payload);
            const index = state.videos.findIndex(video => video.$id === action.payload.$id);
            if (index !== -1) {
                state.videos[index] = action.payload;
            }
            state.isLoading = false;
            state.error = null;
        }).addCase(updateVideo.pending, (state) => {
            state.isLoading = true;
        }).addCase(updateVideo.rejected, (state, action) => {
            console.log(action);
            state.isLoading = false;
            state.error = `An error occurred while creating videos: ${action.payload}`
        })
    }
})

export default videoSlice.reducer;