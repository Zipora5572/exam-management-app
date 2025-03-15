import { combineSlices, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

const store = configureStore({
    reducer: combineSlices(
     
    userSlice,
        
    ),
})

export type StoreType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
