import { LmsVideoTopbar, VideoFrame, ModuleList } from "@/components";
import "../../assets/styles/LmsVideoPlayer.css";
function LmsVideoPlayer() {
  return (
    <div className="lms-video-player-page">
      <LmsVideoTopbar />
      <div className="lms-video-player-container">
        <VideoFrame />
        <ModuleList />
      </div>
    </div>
  );
}

export default LmsVideoPlayer;
