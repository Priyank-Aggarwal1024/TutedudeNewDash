import { Route, Routes } from "react-router-dom";
import "./App.css";
import { LmsVideoPlayer } from "@/pages";
import { Navbar } from "@/components";
function App() {
  return (
    <>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<LmsVideoPlayer />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
