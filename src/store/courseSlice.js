import { databases } from "@/lib/appwrite";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ID, Query } from "appwrite";

export const COURSES_DATABASE_ID = "678fc38f000034b5a490";
export const COURSES_COLLECTION_ID = "678fca0d002e7626e64a";

export const getCourses = createAsyncThunk("courses/get", async (authorId, { rejectWithValue }) => {
    try {
        const response = await databases.listDocuments(
            COURSES_DATABASE_ID, COURSES_COLLECTION_ID, [Query.equal("author_id", authorId)]
        );
        console.log("Fetched Courses for the user : ", authorId);
        return response;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message);
    }
})

export const createCourse = createAsyncThunk("courses/post", async (course, { rejectWithValue }) => {
    try {
        const response = await databases.createDocument(
            COURSES_DATABASE_ID, COURSES_COLLECTION_ID, ID.unique(), course
        );
        console.log("Course has been created successfully!");
        return response;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message);
    }
})

const initialState = {
    courses: [],
    isLoggedIn: false,
    isLoading: false,
    error: null
}

export const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCourses.fulfilled, (state, action) => {
            state.courses = action.payload.documents;
            state.isLoading = false;
            state.error = null;
        }).addCase(getCourses.pending, (state) => {
            state.isLoading = true;
        }).addCase(getCourses.rejected, (state, action) => {
            state.isLoading = false;
            state.error = `An error occurred while fetching courses: ${action.payload}`
        }).addCase(createCourse.fulfilled, (state, action) => {
            state.courses = [...state.courses, action.payload];
            state.isLoading = false;
            state.error = null;
        }).addCase(createCourse.pending, (state) => {
            state.isLoading = true;
        }).addCase(createCourse.rejected, (state, action) => {
            state.isLoading = false;
            state.error = `An error occurred while creating course: ${action.payload}`
        })
    }
})

export default courseSlice.reducer;