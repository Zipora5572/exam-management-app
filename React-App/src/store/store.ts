import { combineSlices, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import examSlice from "./examSlice";
import studentExamSlice from "./studentExamSlice";

const store = configureStore({
    reducer: combineSlices(
      userSlice,
      examSlice,
      studentExamSlice
    ),
})

export type StoreType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
