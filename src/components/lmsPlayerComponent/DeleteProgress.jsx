import React from "react";
import "@/assets/styles/DeleteProgress.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setDeleteProgress } from "@/features/course/courseSlice";
import ModuleList from "./ModuleList";
function DeleteProgress({ fetchUserProgress, email }) {
  const dispatch = useDispatch();
  const { course: courseData, deleteProgress } = useSelector(
    (state) => state.course
  );
  const deleteProgressHandler = async () => {
    console.log({
      email,
      courseId: courseData._id,
      lectureIds: deleteProgress.map((item) => item.id),
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/lms/course/lecture/deleteProgress`,
        {
          email,
          courseId: courseData._id,
          lectureIds: deleteProgress.map((item) => item.id),
        }
      );
      if (response.data && response.data.success) {
        dispatch(setDeleteProgress([]));
        fetchUserProgress(courseData._id, courseData);
      }
    } catch (error) {}
  };
  return (
    <div className="delete-progress-container">
      <div className="delete-progress-content">
        <div className="delete-progress-main-cont">
          <h3 className="delete-progress-title">
            Delete Completed Lectures Progress
          </h3>
          <div className="delete-progress-main-cont-inner">
            {deleteProgress.map((item) => (
              <div
                className="delete-progress-main-cont-inner-item"
                key={item.id}
              >
                <div className="delete-progress-main-cont-inner-item-title">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ModuleList />
        <div className="delete-progress-main-cont-inner-item-buttons">
          <button
            className="delete-progress-main-cont-inner-item-cbutton"
            onClick={() => dispatch(setDeleteProgress([]))}
          >
            Cancel
          </button>
          <button
            className="delete-progress-main-cont-inner-item-dbutton"
            onClick={deleteProgressHandler}
          >
            Delete Progress
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProgress;
