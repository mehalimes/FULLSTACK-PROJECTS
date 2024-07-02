import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../slices/appSlice.jsx";

export default configureStore({
    reducer: {
        app: appReducer,
    },
})