import "../../assets/styles/ShareOnLinkedin.css";
import { shareDesign, shareLogo, pythonIcon } from "@/assets";
function ShareOnLinkedin() {
  return (
    <div className="share-on-linkedin-comp">
      <div className="share-on-linkedin">
        <div className="share-on-linkedin-header">Share on your LinkedIn </div>
        <div className="share-on-linkedin-body">
          Hey connections! 👋 I’m excited to share that i’ve just joined
          Tutedude to level up my python skills!
          <br />
          <br />
          Looking forward to this journey and all the skills I’ll gain along the
          way. Let’s keep pushing boundaries and learning together! #Tutedude
          #coding #python
        </div>
        <div
          className="share-on-linkedin-image"
          style={{
            backgroundImage: `url(${shareDesign})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        >
          <img src={shareLogo} alt="share-logo" />
          <div className="share-iit-delhi-alumni-initiative">
            An IIT Delhi Alumni Initiative
          </div>
          <div className="share-linkedin-body">
            <div className="share-linkedin-body-text">Excited to learn</div>
            <div className="share-linkedin-body-course">Python</div>
          </div>
          <img src={pythonIcon} alt="python-icon" />
        </div>
        <div className="share-on-linkedin-button">Share Now </div>
      </div>
    </div>
  );
}

export default ShareOnLinkedin;
