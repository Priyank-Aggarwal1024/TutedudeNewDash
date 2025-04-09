import { useDispatch, useSelector } from "react-redux";
import "../../assets/styles/ModuleList.css";
import { DownSvg, PlayIconSvg, emerald, StatusSvg } from "@/assets";
import { useState } from "react";
import { setCurrentWatching } from "@/features/course/courseSlice";
function ModuleList() {
  const { currentWatching, course } = useSelector((state) => state.course);
  const _moduleList = course?.sections?.map((section) => {
    let obj;
    if (!section["assignment_id"]) {
      const _lectureList = section?.section_lectures?.map((lecture) => {
        return {
          ...lecture,
          isActive:
            lecture.lecture_no === currentWatching.lecture_no &&
            section.section_no === currentWatching.section_no,
          completed: false,
        };
      });
      const completed = _lectureList.reduce(
        (count, lec) => (lec.completed ? count + 1 : count),
        0
      );
      obj = {
        duration: "52 min",
        total_lecture: _lectureList.length,
        completed_lecture: completed,
        section_lectures: _lectureList,
        type: "module",
      };
    } else {
      obj = {
        gems: 30,
        status: "Pending Review",
        type: "assignment",
      };
    }
    return {
      ...section,
      ...obj,
    };
  });
  const [openModule, setOpenModule] = useState([
    {
      type: "module",
      section_no: 1,
    },
    {
      type: "assignment",
      assignment_no: 1,
    },
  ]);
  const dispatch = useDispatch();
  const handleLectureClick = (module, lecture) => {
    dispatch(
      setCurrentWatching({
        ...currentWatching,
        section_no: module.section_no,
        lecture_no: lecture.lecture_no,
        lecture_name: lecture.lecture_name,
        section_name: module.section_name,
      })
    );
  };

  return (
    <div className="lmsvp-module-list-container">
      <div className="lmsvp-module-list">
        {_moduleList.map((module) =>
          module.type == "assignment" ? (
            <div
              className={`lmsvp-assignment ${
                openModule[1].assignment_no == module.assignment_no &&
                "lmsvp-assignment-open"
              }`}
              key={`assignment-${module.assignment_id}`}
            >
              <div
                className="lmsvp-assignment-top"
                onClick={() => {
                  setOpenModule((prev) => {
                    return prev.map((item) => {
                      if (item.type == "assignment") {
                        return {
                          ...item,
                          assignment_no:
                            item.assignment_no == module.assignment_no
                              ? -1
                              : module.assignment_no,
                        };
                      }
                      return item;
                    });
                  });
                }}
              >
                <div className="lmsvp-assignment-top-left">
                  <div className="lmsvp-assignment-top-left-title">
                    Assignment {module.assignment_no}
                  </div>
                  <div className="lmsvp-assignment-top-left-gems">
                    <img src={emerald} alt="gems" />
                    <p>{module.gems} Gems</p>
                  </div>
                </div>
                {openModule[1].assignment_no == module.assignment_no ? (
                  <DownSvg style={{ transform: "rotate(180deg)" }} />
                ) : (
                  <DownSvg />
                )}
              </div>
              <div
                className={`lmsvp-assignment-bottom ${
                  openModule[1].assignment_no == module.assignment_no
                    ? "lmsvp-assignment-bottom-open"
                    : "lmsvp-assignment-bottom-close"
                }`}
              >
                <div className="lmsvp-assignment-bottom-title">
                  {module.assignment_name}
                </div>
                <div className="lmsvp-assignment-bottom-row">
                  <div className="lmsvp-assignment-bottom-status">
                    {module.status == "Pending Review" ? (
                      <StatusSvg fill1="#FFBE40" fill2="#FFB912" />
                    ) : (
                      <StatusSvg fill1="#FFBE40" fill2="#FFB912" />
                    )}
                    <div className="lmsvp-assignment-bottom-status-text">
                      {module.status}
                    </div>
                  </div>
                  {openModule[1].assignment_no == module.assignment_no && (
                    <div className="lmsvp-assignment-bottom-row-options">
                      <div
                        className="lmsvp-assignment-bottom-row-options-view"
                        onClick={() =>
                          module["assignment_links"] &&
                          window.open(module["assignment_links"], "_blank")
                        }
                      >
                        View task
                      </div>
                      <div className="lmsvp-assignment-bottom-row-options-submit">
                        Submit task
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`lmsvp-module ${
                openModule[0].section_no == module.section_no &&
                "lmsvp-module-open"
              }`}
              key={`module-${module.section_no}`}
            >
              <div
                className="lmsvp-module-top"
                onClick={() => {
                  setOpenModule((prev) => {
                    return prev.map((item) => {
                      if (item.type == "module") {
                        return {
                          ...item,
                          section_no:
                            item.section_no == module.section_no
                              ? -1
                              : module.section_no,
                        };
                      }
                      return item;
                    });
                  });
                }}
              >
                <div className="lmsvp-module-top-top">
                  <span className="lmsvp-module-top-title">
                    Module {module.section_no}: {module.section_name}
                  </span>
                  {openModule[0].section_no == module.section_no ? (
                    <DownSvg style={{ transform: "rotate(180deg)" }} />
                  ) : (
                    <DownSvg />
                  )}
                </div>
                <div className="lmsvp-module-top-duration">
                  <span>{module.duration}</span>
                  <div className="lmsvp-module-top-vertical-line"></div>
                  <span>
                    {module.completed_lecture} / {module.total_lecture} lectures
                  </span>
                </div>
              </div>
              {openModule[0].section_no == module.section_no && (
                <div className="lmsvp-module-bottom">
                  {module.section_lectures.map((lecture) => (
                    <div
                      className="lmsvp-module-bottom-lecture"
                      onClick={() => handleLectureClick(module, lecture)}
                      key={`lecture-${lecture.lecture_no}`}
                    >
                      <div className="lmsvp-module-bottom-lecture-left">
                        <div className="lmsvp-module-bottom-lecture-left-icon">
                          <PlayIconSvg
                            color={
                              currentWatching.section_no == module.section_no &&
                              currentWatching.lecture_no == lecture.lecture_no
                                ? "#800080"
                                : "#666666"
                            }
                          />
                        </div>
                        <div className="lmsvp-module-bottom-lecture-left-title">
                          {lecture.lecture_no}. {lecture.lecture_name}
                        </div>
                      </div>
                      <div className="lmsvp-module-bottom-lecture-right">
                        {!lecture.completed ? (
                          <input
                            type="checkbox"
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: "#38A333",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            checked
                          />
                        ) : (
                          <input
                            type="checkbox"
                            style={{ width: "18px", height: "18px" }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ModuleList;
