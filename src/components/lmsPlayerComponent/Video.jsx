import { useEffect, useRef, useState, useCallback } from "react";
import dashjs from "dashjs";
import "@/assets/styles/Video.css";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import { BackwardSvg, ForwardSvg } from "@/assets";
import { formatTime } from "@/utils/utils";
import axios from "axios";
import { useSelector } from "react-redux";
const DEFAULT_MANIFEST_URL =
  "https://storage.googleapis.com/tutedude694/testing/Tableau/The%20Business%20Challenge%20-%20Who%20Gets%20the%20Annual%20Reward/manifest.mpd";

function Video({
  url = DEFAULT_MANIFEST_URL,
  currentWatching,
  email,
  updateUserProgress,
}) {
  const { course: courseData } = useSelector((state) => state.course);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const watchedFragmentsRef = useRef(new Map());
  const lastTimeRef = useRef(currentWatching?.lastTime || 0);
  const lastUpdateTimeRef = useRef(Date.now());

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState({
    completed: currentWatching.lastTime || 0,
    total: 0,
  });
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoQualities, setVideoQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [showSettings, setShowSettings] = useState(false);
  const [realProgress, setRealProgress] = useState(0);
  const completedSegmentsRef = useRef(new Set());
  const THROTTLE_MS = 100;
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const now = Date.now();
    if (now - lastUpdateTimeRef.current < THROTTLE_MS) return;
    lastUpdateTimeRef.current = now;

    const currentTime = video.currentTime;
    const totalDuration = video.duration;
    const progressPercent = (currentTime / totalDuration) * 100;

    setProgress(progressPercent);
    setDuration({
      completed: Math.floor(currentTime),
      total: Math.floor(totalDuration),
    });

    const currentSecond = Math.floor(currentTime);
    const fragmentIndex = Math.floor(currentSecond / 60);

    // Ensure the fragment is tracked
    if (!watchedFragmentsRef.current.has(fragmentIndex)) {
      watchedFragmentsRef.current.set(fragmentIndex, new Set());
    }
    watchedFragmentsRef.current.get(fragmentIndex).add(currentSecond);

    // Determine the fragment's start and end times
    const fragmentStart = fragmentIndex * 60;
    const fragmentEnd = Math.min(fragmentStart + 60, Math.ceil(video.duration));
    const fragmentDuration = fragmentEnd - fragmentStart;

    // Check if this fragment has reached 90% completion and hasn't been logged yet
    if (
      !completedSegmentsRef.current.has(fragmentIndex) &&
      watchedFragmentsRef.current.get(fragmentIndex).size / fragmentDuration >=
        0.8
    ) {
      console.log(
        `Fragment ${fragmentIndex} (${Math.floor(
          fragmentStart / 60
        )}-${Math.floor(fragmentEnd / 60)} ) completed`
      );
      completedSegmentsRef.current.add(fragmentIndex);
    }

    // Optionally, update overall progress across all fragments if needed
    let completedFragments = 0;
    watchedFragmentsRef.current.forEach((secondsSet, idx) => {
      const start = idx * 60;
      const end = Math.min(start + 60, Math.ceil(video.duration));
      const fragDuration = end - start;
      if (secondsSet.size / fragDuration >= 0.8) {
        completedFragments++;
      }
    });
    const totalFragments = Math.ceil(totalDuration / 60);
    const realProgressPercent = (completedFragments / totalFragments) * 100;
    setRealProgress(Math.floor(realProgressPercent));
  }, []);

  useEffect(() => {
    completedSegmentsRef.current = new Set();
    watchedFragmentsRef.current = new Map();
    lastTimeRef.current = currentWatching.lastTime || 0;
    lastUpdateTimeRef.current = Date.now();

    setIsPlaying(false);
    setDuration({
      completed: currentWatching.lastTime || 0,
      total: 0,
    });
    setProgress(0);
    setFullscreen(false);
    setVideoQualities([]);
    setSelectedQuality("auto");
    setShowSettings(false);
    setRealProgress(0);

    if (videoRef.current) {
      videoRef.current.volume = 0.5;
      videoRef.current.currentTime =
        JSON.parse(localStorage.getItem("currentWatching"))?.lastTime || 0;
    }
  }, [url, currentWatching]);
  const getSegments = () => {
    const segments = [];
    [...watchedFragmentsRef.current.values()].forEach((set) => {
      segments.push(...Array.from(set).map((ele) => `${ele}-${ele + 1}`));
    });
    return segments;
  };
  const handleVideoEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const totalDuration = video.duration;
    const totalFragments = Math.ceil(totalDuration / 60);
    let completedFragments = 0;

    watchedFragmentsRef.current.forEach((secondsSet, idx) => {
      const start = idx * 60;
      const end = Math.min(start + 60, Math.ceil(video.duration));
      const fragmentDuration = end - start;

      if (secondsSet.size / fragmentDuration >= 0.8) {
        completedFragments++;
      }
    });

    const percentWatched = (completedFragments / totalFragments) * 100;

    console.log("Video ended!");
    console.log(`Watched Fragments: ${completedFragments}/${totalFragments}`);
    console.log(`Watched Percent: ${percentWatched.toFixed(2)}%`);

    const data = {
      email,
      lastTime: videoRef.current.currentTime,
      videoDuration: videoRef.current.duration,
      segments: getSegments(),
    };
    console.log(data);
    if (percentWatched >= 80) {
      console.log("✅ Sending completion data to API...");
      updateUserProgress(data);
    } else {
      console.log("❌ Video not completed - Less than 80% watched");
      alert("Please watch at least 80% of the video to mark it as complete.");
    }
  }, []);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    playerRef.current = player;

    player.initialize(videoRef.current, url, false);

    player.on("streamInitialized", () => {
      const availableQualities = player.getBitrateInfoListFor("video");
      const qualities = availableQualities.map((quality, index) => ({
        id: index.toString(),
        height: quality.height,
        bitrate: quality.bitrate,
      }));
      setVideoQualities([
        { id: "auto", height: "Auto", bitrate: null },
        ...qualities,
      ]);
      setSelectedQuality("auto");
      setDuration((prev) => ({
        ...prev,
        total: Math.floor(player.duration()),
      }));

      player.updateSettings({
        streaming: {
          abr: { autoSwitchBitrate: { video: true } },
        },
      });
    });

    return () => {
      player.reset();
    };
  }, [url]);

  //   Add video event listeners

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleVideoEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleVideoEnded);
    };
  }, [handleTimeUpdate, handleVideoEnded]);

  // Hide controls on mouse inactivity
  useEffect(() => {
    let timeoutId;
    const videoContainer = videoRef.current?.parentElement;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowControls(false), 3000);
    };

    videoContainer?.addEventListener("mousemove", handleMouseMove);
    return () => {
      videoContainer?.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  }, []);

  const skipForward = useCallback(() => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  }, []);

  const skipBackward = useCallback(() => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  const toggleSettingsPopup = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  const adjustVolume = useCallback((delta) => {
    setVolume((prev) => {
      const newVolume = Math.max(0, Math.min(prev + delta, 100));
      if (videoRef.current) videoRef.current.volume = newVolume / 100;
      return newVolume;
    });
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.volume > 0) {
        videoRef.current.volume = 0;
        setVolume(0);
      } else {
        videoRef.current.volume = 0.5;
        setVolume(50);
      }
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
        return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
        case "KeyJ":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
        case "KeyL":
          e.preventDefault();
          skipForward();
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(10);
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(-10);
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyS":
          e.preventDefault();
          toggleSettingsPopup();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlayPause,
    skipBackward,
    skipForward,
    adjustVolume,
    toggleFullscreen,
    toggleSettingsPopup,
    toggleMute,
  ]);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    if (videoRef.current) videoRef.current.volume = newVolume / 100;
    setVolume(newVolume);
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(parseInt(e.target.value, 10));
  };
  const fetchInitialProgress = async () => {
    try {
      const sentData = {
        email,
        courseId: currentWatching.courseId,
        lectureId: currentWatching.lecture_id,
      };
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/lms/course/lecture/getVideoProgress`,
        {
          params: sentData,
        }
      );
      if (data.success) {
        data.data.forEach((item) => {
          let seg = item.split("-");
          completedSegmentsRef.current.add(seg[0]);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleQualityChange = (qualityId) => {
    setSelectedQuality(qualityId);
    const player = playerRef.current;
    if (!player) return;

    if (qualityId === "auto") {
      player.updateSettings({
        streaming: { abr: { autoSwitchBitrate: { video: true } } },
      });
    } else {
      player.updateSettings({
        streaming: { abr: { autoSwitchBitrate: { video: false } } },
      });
      player.setQualityFor("video", parseInt(qualityId, 10));
    }
    setShowSettings(false);
  };
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      const data = {
        email,
        lastTime: videoRef.current.currentTime,
        videoDuration: videoRef.current.duration,
        segments: getSegments(),
      };
      await updateUserProgress(data);
      return "You have unsaved changes. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [courseData, currentWatching, email]);
  useEffect(() => {
    if (email && courseData && courseData?._id && currentWatching?.lecture_id) {
      fetchInitialProgress();
    }
  }, [currentWatching]);

  return (
    <div className="new-video-player-container">
      <div className="new-video-pause-overlay" onClick={togglePlayPause}>
        {!isPlaying && (
          <div className="new-video-pause-overlay-bg">
            <div className="new-video-pause-overlay-content">
              <Play color="#800080" className="new-control-icon" />
            </div>
          </div>
        )}
      </div>

      <video
        ref={videoRef}
        className="new-video-player"
        width="100%"
        height="100%"
      />

      {showSettings && (
        <div className="new-settings-popup">
          {videoQualities.map((quality) => (
            <p
              key={quality.id}
              className={`new-quality-option ${
                selectedQuality === quality.id ? "selected" : ""
              }`}
              onClick={() => handleQualityChange(quality.id)}
            >
              {quality.height === "Auto" ? "Auto" : `${quality.height}p`}
            </p>
          ))}
        </div>
      )}

      <div className={`new-video-controls ${showControls ? "visible" : ""}`}>
        <div className="new-progress-bar">
          <input
            type="range"
            className="new-progress-slider"
            min="0"
            max="100"
            value={progress}
            onInput={handleProgressChange}
            style={{
              background: `linear-gradient(to right, #800080 0%, #800080 ${progress}%, #f7ebfd ${progress}%, #f7ebfd 100%)`,
            }}
          />
        </div>
        <div className="new-controls-wrapper">
          <div className="new-controls-left">
            {isPlaying ? (
              <Pause
                color="#f7ebfd"
                className="new-control-icon"
                onClick={togglePlayPause}
              />
            ) : (
              <Play
                color="#f7ebfd"
                className="new-control-icon"
                onClick={togglePlayPause}
              />
            )}
            <div className="new-skip-buttons">
              <BackwardSvg color="#f7ebfd" onClick={skipBackward} />
              <ForwardSvg color="#f7ebfd" onClick={skipForward} />
            </div>
            {volume === 0 ? (
              <VolumeX
                color="#f7ebfd"
                className="new-control-icon"
                onClick={toggleMute}
              />
            ) : (
              <Volume2
                color="#f7ebfd"
                className="new-control-icon"
                onClick={toggleMute}
              />
            )}
            <input
              type="range"
              className="new-volume-slider"
              min="0"
              max="100"
              value={volume}
              onInput={handleVolumeChange}
              style={{
                background: `linear-gradient(to right, #800080 0%, #800080 ${volume}%, #f7ebfd ${volume}%, #f7ebfd 100%)`,
              }}
            />
            <div className="new-time-display">
              <p>
                {formatTime(duration.completed)} / {formatTime(duration.total)}
              </p>
            </div>
          </div>
          <div className="new-controls-right">
            <Settings
              color="#f7ebfd"
              className="new-control-icon"
              onClick={toggleSettingsPopup}
            />
            {fullscreen ? (
              <Minimize
                color="#f7ebfd"
                className="new-control-icon"
                onClick={toggleFullscreen}
              />
            ) : (
              <Maximize
                color="#f7ebfd"
                className="new-control-icon"
                onClick={toggleFullscreen}
              />
            )}
          </div>
        </div>
      </div>

      <div className="new-actual-progress-bar">
        <div
          className="new-actual-progress-bar-fill"
          style={{ width: `${realProgress}%`, height: "100%" }}
        ></div>
      </div>
    </div>
  );
}

export default Video;
