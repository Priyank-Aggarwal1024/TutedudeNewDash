import "../../assets/styles/VideoFrame.css";
import {
  videoFrame,
  DownloadSvg,
  FeedbackIconSvg,
  RightArrowSvg,
} from "@/assets";
import { useSelector } from "react-redux";
function VideoFrame() {
  const currentWatching = useSelector((state) => state.course.currentWatching);
  return (
    <div className="video-frame">
      <img src={videoFrame} alt="video-frame" />
      <div className="video-frame-content flex justify-between items-center">
        <div className="video-frame-content-left">
          <h2 className="video-frame-content-left-title">
            Module {currentWatching.section_no}.{" "}
            <span className="fw-700">{currentWatching.section_name}</span>
          </h2>
          <h3 className="video-frame-content-left-lecture-title">
            {currentWatching.lecture_no}. {currentWatching.lecture_name}
          </h3>
        </div>
        <div className="video-frame-content-right">
          <div className="video-frame-content-right-button video-frame-content-right-button-certificate">
            <div className="video-frame-content-right-button-text">
              Certificate
            </div>
            <DownloadSvg />
          </div>
          <div className="video-frame-content-right-button video-frame-content-right-button-resources">
            <div className="video-frame-content-right-button-text">
              Resources
            </div>
            <DownloadSvg />
          </div>
        </div>
      </div>
      <div className="video-frame-content-bottom">
        <div className="video-frame-content-bottom-feedback">
          <div className="video-frame-content-bottom-feedback-left">
            <FeedbackIconSvg />
            <div className="video-frame-content-bottom-feedback-left-right">
              <div className="video-frame-content-bottom-feedback-left-right-title">
                Any feedback and Suggestions ??
              </div>
              <div className="video-frame-content-bottom-feedback-left-right-text">
                We would love to hear your thoughts, suggestions, concerns or
                problems with anything so we can improve!
              </div>
            </div>
          </div>
          <div className="video-frame-content-bottom-feedback-right-button">
            <span>Give your feedback</span>
            <RightArrowSvg />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoFrame;
