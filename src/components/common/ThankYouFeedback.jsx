import "@/assets/styles/ThankYouFeedback.css";
import { useDispatch } from "react-redux";
import { setIsThankYouOpen } from "@/features/comp/compSlice";
function ThankYouFeedback() {
  const dispatch = useDispatch();
  return (
    <div
      className="thank-you-feedback-comp"
      onClick={() => dispatch(setIsThankYouOpen(false))}
    >
      <div className="thank-you-feedback" onClick={(e) => e.stopPropagation()}>
        <div className="thank-you-feedback-title">
          Thank you for your valuable feedback!
        </div>
        <div className="thank-you-feedback-description">
          We would love to hear your thoughts, suggestions, concerns or problems
          with anything so we can improve!{" "}
        </div>
        <div
          className="thank-you-feedback-button"
          onClick={() => dispatch(setIsThankYouOpen(false))}
        >
          Ok
        </div>
      </div>
    </div>
  );
}

export default ThankYouFeedback;
