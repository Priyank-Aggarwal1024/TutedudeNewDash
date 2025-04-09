import { combineReducers } from "@reduxjs/toolkit";
import navbarReducer from "@/features/navbar/navbarSlice";
import userReducer from "@/features/user/userSlice";
import courseReducer from "@/features/course/courseSlice";
const rootReducer = combineReducers({
  navbar: navbarReducer,
  user: userReducer,
  course: courseReducer,
});

export default rootReducer;
