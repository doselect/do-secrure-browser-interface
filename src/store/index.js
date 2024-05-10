// store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlices";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Add other reducers as needed
  },
});

export default store;
