import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    isOpen: false,
  },
  reducers: {
    toggleNavbar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleNavbar } = navbarSlice.actions;

export default navbarSlice.reducer;
