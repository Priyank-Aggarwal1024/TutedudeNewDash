import "@/assets/styles/SendFeedback.css";
import { useDispatch } from "react-redux";
import {
  setIsFeedbackOpen,
  setIsThankYouOpen,
} from "@/features/comp/compSlice";
function SendFeedback() {
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setIsFeedbackOpen(false));
    dispatch(setIsThankYouOpen(true));
  };
  return (
    <div
      className="send-feedback-comp"
      onClick={() => dispatch(setIsFeedbackOpen(false))}
    >
      <div
        className="send-feedback-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="send-feedback">Send Feedback</div>
        <div className="send-feedback-description">
          We would love to hear your thoughts, suggestions, concerns or problems
          with anything so we can improve!
        </div>
        <form className="send-feedback-form" onSubmit={handleSubmit}>
          <label
            htmlFor="describe-your-thoughts"
            className="send-feedback-form-label"
          >
            Describe your Thoughts
          </label>
          <textarea
            id="describe-your-thoughts"
            className="send-feedback-form-textarea"
          />
          <button type="submit" className="send-feedback-form-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendFeedback;
