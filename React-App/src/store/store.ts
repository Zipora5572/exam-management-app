import { combineSlices, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import examSlice from "./examSlice";

const store = configureStore({
    reducer: combineSlices(
      userSlice,
      examSlice
    ),
})

export type StoreType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
