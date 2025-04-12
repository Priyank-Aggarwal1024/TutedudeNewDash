import { Route, Routes } from "react-router-dom";
import "./App.css";
import { LmsVideoPlayer } from "@/pages";
import {
  Navbar,
  SendFeedback,
  ThankYouFeedback,
  ShareOnLinkedin,
  Login,
} from "@/components";
import { useSelector } from "react-redux";
function App() {
  const { isFeedbackOpen, isThankYouOpen, isShareOpen, isLoginOpen } =
    useSelector((state) => state.comp);
  if (isLoginOpen) {
    return <Login />;
  }
  return (
    <>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/lecture/:slug" element={<LmsVideoPlayer />} />
        </Routes>
        {isFeedbackOpen && <SendFeedback />}
        {isThankYouOpen && <ThankYouFeedback />}
        {isShareOpen && <ShareOnLinkedin />}
      </div>
    </>
  );
}

export default App;
