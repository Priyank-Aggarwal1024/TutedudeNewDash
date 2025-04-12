import {
  LmsVideoTopbar,
  VideoFrame,
  ModuleList,
  DeleteProgress,
} from "@/components";
import "@/assets/styles/LmsVideoPlayer.css";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoginOpen } from "@/features/comp/compSlice";
import {
  setUserProgress,
  setCurrentWatching,
  setCourse,
} from "@/features/course/courseSlice";
import axios from "axios";
function LmsVideoPlayer() {
  const dispatch = useDispatch();
  const {
    currentWatching,
    course: courseData,
    deleteProgress,
  } = useSelector((state) => state.course);
  const email = Cookies.get("user_email") || "";
  const { slug } = useParams();
  const [userData, setUserData] = useState(null);
  const fetchUserData = useCallback(async () => {
    try {
      const encodedEmail = encodeURIComponent(email);
      const { data } = await axios.get(
        `https://api.tutedude.com/lms/auth/dashboard?student_id=${encodedEmail}`
      );
      if (data.success) {
        setUserData(data.dashboard);
      }
    } catch (error) {
      console.log(error);
    }
  }, [email]);

  const fetchCourseData = useCallback(async () => {
    const apiUrl = `${
      import.meta.env.VITE_APP_API_URL
    }/lms/API/getCourseContent?course=${slug}`;

    try {
      const { data } = await axios.get(apiUrl);
      if (data?.success && data?.data?.length > 0) {
        dispatch(setCourse(data.data[0]));
      } else {
        console.warn(data);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  }, [slug]);

  const fetchUserProgress = useCallback(
    async (courseId, courseData) => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/lms/course/getProgress?email=${email}&courseId=${courseId}`
        );
        if (data.success) {
          dispatch(setUserProgress(data.data.overallProgress));
          let lastLecture = data.data.overallProgress.lastLecture;
          if (lastLecture?.lectureId) {
            courseData.sections.forEach((modul, idx) => {
              modul.lectures.forEach((l, i) => {
                if (l._id === lastLecture.lectureId) {
                  dispatch(
                    setCurrentWatching({
                      section_no: idx + 1,
                      lecture_no: i + 1,
                      section_name: modul.sectionName,
                      lecture_name: l.lectureName,
                      lecture_progress: lastLecture.lastTime,
                      courseId: courseId,
                      lecture_id: l._id,
                    })
                  );
                }
              });
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [slug, email]
  );

  const updateUserProgress = useCallback(
    async (saveData) => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/lms/course/lecture/saveProgress`,
          {
            ...saveData,
            courseId: currentWatching.courseId,
            lectureId: currentWatching.lecture_id,
          }
        );
        console.log(data);
        fetchUserProgress(currentWatching.courseId);
      } catch (error) {
        console.log(error);
      }
    },
    [slug, email]
  );
  useEffect(() => {
    if (!slug || !email) {
      dispatch(setIsLoginOpen(true));
    }
  }, [slug, email]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchCourseData();
  }, [slug, fetchCourseData]);

  useEffect(() => {
    if (courseData && courseData?._id) {
      fetchUserProgress(courseData._id, courseData);
    }
  }, [fetchUserProgress, courseData, fetchCourseData]);

  return (
    <div className="lms-video-player-page">
      {deleteProgress.length > 0 && (
        <DeleteProgress fetchUserProgress={fetchUserProgress} email={email} />
      )}
      <LmsVideoTopbar />
      <div className="lms-video-player-container">
        <VideoFrame
          email={email}
          slug={slug}
          updateUserProgress={updateUserProgress}
        />
        <ModuleList />
      </div>
    </div>
  );
}

export default LmsVideoPlayer;
