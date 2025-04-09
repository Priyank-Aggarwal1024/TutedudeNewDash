import { createSlice } from "@reduxjs/toolkit";
import { course } from "@/constant";
const initialState = {
  progress: 20,
  course: course,
  currentWatching: {
    section_no: 1,
    lecture_no: 1,
    section_name: "Introducing Microsoft Power BI",
    lecture_name: "Power BI Introduction",
    lecture_progress: 50,
  },
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setCurrentWatching: (state, action) => {
      state.currentWatching = action.payload;
    },
  },
});

export const { setProgress, setCourse, setCurrentWatching } =
  courseSlice.actions;
export default courseSlice.reducer;
