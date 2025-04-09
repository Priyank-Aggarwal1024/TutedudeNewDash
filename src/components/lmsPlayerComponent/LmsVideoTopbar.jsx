import { bronzeMedal, fire, emerald, BackSvg, SmallDownSvg } from "@/assets";
import "@/assets/styles/LmsVideoTopbar.css";
import { useSelector } from "react-redux";
function LmsVideoTopbar() {
  const { progress, course } = useSelector((state) => state.course);
  const user = useSelector((state) => state.user.user);
  return (
    <div className="lms-video-topbar">
      <div className="lms-video-topbar-left flex items-center">
        <BackSvg />
        <h2 className="lms-video-topbar-title turncate-text">
          {course.course_name}
        </h2>
      </div>
      <div className="lms-video-topbar-right flex items-center">
        <div className="lms-video-topbar-right-options">
          <div className="lms-video-topbar-right-options-item lms-video-topbar-right-options-streak">
            <img src={fire} alt="fire" />
            <p className="lms-video-topbar-right-options-item-title fw-400">
              Streaks
            </p>
            <p className="lms-video-topbar-right-options-item-title fw-600">
              {user.streak}
            </p>
            <SmallDownSvg />
          </div>
          <div className="lms-video-topbar-right-options-item lms-video-topbar-right-options-rank">
            <img src={bronzeMedal} alt="bronzeMedal" />
            <p className="lms-video-topbar-right-options-item-title fw-400">
              Rank
            </p>
            <p className="lms-video-topbar-right-options-item-title fw-600">
              {user.rank}
            </p>
            <SmallDownSvg />
          </div>
          <div className="lms-video-topbar-right-options-item lms-video-topbar-right-options-gems">
            <img src={emerald} alt="emerald" />
            <p className="lms-video-topbar-right-options-item-title fw-400 hidden-title">
              Gems
            </p>
            <p className="lms-video-topbar-right-options-item-title fw-600">
              {user.gems}
            </p>
            <SmallDownSvg />
          </div>
        </div>
        <div className="lms-video-topbar-right-progress">
          <div className="lms-video-topbar-right-progress-title-container flex justify-between items-center">
            <p className="lms-video-topbar-right-progress-title">
              Course Progress
            </p>
            <p className="lms-video-topbar-right-progress-number">
              {progress}%
            </p>
          </div>
          <div className="lms-video-topbar-right-progress-bar">
            <div
              className="lms-video-topbar-right-progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="lms-video-topbar-oldcourse">Access old course</div>
      </div>
    </div>
  );
}

export default LmsVideoTopbar;
