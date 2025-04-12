import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFeedbackOpen: false,
  isThankYouOpen: false,
  isShareOpen: false,
  isLoginOpen: false,
};

const compSlice = createSlice({
  name: "comp",
  initialState,
  reducers: {
    setIsFeedbackOpen: (state, action) => {
      state.isFeedbackOpen = action.payload;
    },
    setIsThankYouOpen: (state, action) => {
      state.isThankYouOpen = action.payload;
    },
    setIsShareOpen: (state, action) => {
      state.isShareOpen = action.payload;
    },
    setIsLoginOpen: (state, action) => {
      state.isLoginOpen = action.payload;
    },
  },
});

export const {
  setIsFeedbackOpen,
  setIsThankYouOpen,
  setIsShareOpen,
  setIsLoginOpen,
} = compSlice.actions;
export default compSlice.reducer;
