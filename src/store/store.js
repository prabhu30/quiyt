import { configureStore } from "@reduxjs/toolkit";
import courseSlice from "./courseSlice";
import videoSlice from "./videoSlice";

export const store = configureStore({
    reducer: {
        courses: courseSlice,
        videos: videoSlice,
    }
})