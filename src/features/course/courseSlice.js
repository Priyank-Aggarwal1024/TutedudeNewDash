import { createSlice } from "@reduxjs/toolkit";
import { course } from "@/constant";
const initialState = {
  progress: 20,
  course: course,
  currentWatching: {
    section_no: 1,
    lecture_no: 1,
    section_name: "It's super easy to get Started",
    lecture_name: "Tableau Introduction",
    lecture_progress: 50,
    lastTime: 0,
    courseId: "",
    lecture_id: "",
  },
  userProgress: {},
  deleteProgress: [],
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
    setUserProgress: (state, action) => {
      state.userProgress = action.payload;
    },
    setDeleteProgress: (state, action) => {
      state.deleteProgress = action.payload;
    },
  },
});

export const {
  setProgress,
  setCourse,
  setCurrentWatching,
  setUserProgress,
  setDeleteProgress,
} = courseSlice.actions;
export default courseSlice.reducer;
