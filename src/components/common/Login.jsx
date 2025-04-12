import "@/assets/styles/Login.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { setIsLoginOpen } from "@/features/comp/compSlice";
import Cookies from "js-cookie";
import { useState } from "react";
import toast from "react-hot-toast";
import { logo, loginLogo } from "@/assets";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const b = false;

  const onLogin = (email, password) => {
    fetch("https://api.tutedude.com/lms/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === "true" || data.success === true) {
          Cookies.set("user_email", email, { domain: ".tuteude.com" });
          Cookies.set("user_email", email);
          Cookies.set("user_name", data.dashboard.studentName);
          if (b) {
            // setShowModal(true);
          } else {
            setIsLoginOpen(false);
            window.location.reload();
          }
        } else {
          toast.error("Invalid Email or Password");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <form
      id="login-section"
      className="login-cont"
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(email.trim(), password.trim());
      }}
    >
      <div className="login-left-cont">
        <div className="login-left">
          <div className="login-left-top">Student’s Dashboard</div>
          <div className="login-left-bottom">
            <img src={loginLogo} alt="LoginLogo" />
          </div>
        </div>
      </div>
      <div className="login-right-cont">
        <div className="login-right">
          <div className="login-right-top">
            <span>Login to</span>
            <img
              src={logo}
              alt="companyLogo"
              style={{ width: "162px", height: "64px" }}
            />
          </div>
          <div className="login-right-bottom">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
              }}
            >
              <div className="google-btn">
                <GoogleOAuthProvider clientId="511870194827-vifvi5s3idbpsrs68m2hbgv0cadp6inc.apps.googleusercontent.com">
                  <GoogleLogin
                    className="googlesign"
                    onSuccess={(credentialResponse) => {
                      const decRes = jwtDecode(credentialResponse.credential);
                      onLogin(decRes.email, "googlesignin");
                    }}
                    onError={(error) => console.log(error)}
                  />
                </GoogleOAuthProvider>
              </div>

              <div
                className="login-right-bottom-d2"
                style={{ textAlign: "center" }}
              >
                OR
              </div>
              <div className="login-right-bottom-d3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                >
                  <g clipPath="url(#clip0_595_641)">
                    <path
                      d="M15.4167 1.33301H4.58333C3.36816 1.33433 2.20314 1.81764 1.34389 2.6769C0.484634 3.53615 0.00132347 4.70117 0 5.91634L0 15.083C0.00132347 16.2982 0.484634 17.4632 1.34389 18.3225C2.20314 19.1817 3.36816 19.665 4.58333 19.6663H15.4167C16.6318 19.665 17.7969 19.1817 18.6561 18.3225C19.5154 17.4632 19.9987 16.2982 20 15.083V5.91634C19.9987 4.70117 19.5154 3.53615 18.6561 2.6769C17.7969 1.81764 16.6318 1.33433 15.4167 1.33301ZM15.4167 3.83301C15.9221 3.83469 16.4092 4.0218 16.7858 4.35884L11.3692 9.77551C11.0013 10.1269 10.5121 10.323 10.0033 10.323C9.49458 10.323 9.0054 10.1269 8.6375 9.77551L3.22083 4.35884C3.59571 4.02332 4.08025 3.83632 4.58333 3.83301H15.4167ZM15.4167 17.1663H4.58333C4.0308 17.1663 3.5009 16.9468 3.11019 16.5561C2.71949 16.1654 2.5 15.6355 2.5 15.083V7.18051L6.86583 11.5463C7.2773 11.958 7.76584 12.2845 8.30353 12.5073C8.84123 12.7301 9.41756 12.8448 9.99958 12.8448C10.5816 12.8448 11.1579 12.7301 11.6956 12.5073C12.2333 12.2845 12.7219 11.958 13.1333 11.5463L17.5 7.18051V15.083C17.5 15.6355 17.2805 16.1654 16.8898 16.5561C16.4991 16.9468 15.9692 17.1663 15.4167 17.1663Z"
                      fill="#374957"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_595_641">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="login-right-bottom-d4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                >
                  <path
                    d="M14.8704 7.59129V6.37029C14.8704 3.12821 12.2422 0.5 9.00009 0.5C5.75802 0.5 3.12984 3.12821 3.12984 6.37025V7.59125C1.58748 8.37835 0.615901 9.96297 0.614014 11.6946V15.8876C0.616805 18.4338 2.68018 20.4972 5.22635 20.5H12.7738C15.32 20.4972 17.3834 18.4338 17.3862 15.8876V11.6946C17.3843 9.96301 16.4127 8.37835 14.8704 7.59129ZM9.00009 3.01583C10.8527 3.01583 12.3545 4.51766 12.3545 6.37025V7.08223H5.64567V6.37025C5.64567 4.51766 7.1475 3.01583 9.00009 3.01583ZM14.8704 15.8876C14.8704 17.0455 13.9317 17.9841 12.7739 17.9841H5.22639C4.06852 17.9841 3.12988 17.0455 3.12988 15.8876V11.6946C3.12988 10.5367 4.06852 9.5981 5.22639 9.5981H12.7739C13.9317 9.5981 14.8704 10.5367 14.8704 11.6946V15.8876V15.8876Z"
                    fill="#4C4D52"
                  />
                  <path
                    d="M8.58091 12.1143H9.4195C10.1142 12.1143 10.6774 12.6774 10.6774 13.3722C10.6774 14.0669 10.1142 14.6301 9.4195 14.6301H8.58091C7.88619 14.6301 7.323 14.0669 7.323 13.3722C7.323 12.6774 7.88619 12.1143 8.58091 12.1143Z"
                    fill="#4C4D52"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "25px" }}
                />
                <svg
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-right-bottom-d4-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <mask
                    id="mask0_595_652"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="25"
                  >
                    <rect y="0.5" width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_595_652)">
                    <path
                      d="M12 16.5C13.25 16.5 14.3125 16.0625 15.1875 15.1875C16.0625 14.3125 16.5 13.25 16.5 12C16.5 10.75 16.0625 9.6875 15.1875 8.8125C14.3125 7.9375 13.25 7.5 12 7.5C10.75 7.5 9.6875 7.9375 8.8125 8.8125C7.9375 9.6875 7.5 10.75 7.5 12C7.5 13.25 7.9375 14.3125 8.8125 15.1875C9.6875 16.0625 10.75 16.5 12 16.5ZM12 14.7C11.25 14.7 10.6125 14.4375 10.0875 13.9125C9.5625 13.3875 9.3 12.75 9.3 12C9.3 11.25 9.5625 10.6125 10.0875 10.0875C10.6125 9.5625 11.25 9.3 12 9.3C12.75 9.3 13.3875 9.5625 13.9125 10.0875C14.4375 10.6125 14.7 11.25 14.7 12C14.7 12.75 14.4375 13.3875 13.9125 13.9125C13.3875 14.4375 12.75 14.7 12 14.7ZM12 19.5C9.56667 19.5 7.35 18.8208 5.35 17.4625C3.35 16.1042 1.9 14.2833 1 12C1.9 9.71667 3.35 7.89583 5.35 6.5375C7.35 5.17917 9.56667 4.5 12 4.5C14.4333 4.5 16.65 5.17917 18.65 6.5375C20.65 7.89583 22.1 9.71667 23 12C22.1 14.2833 20.65 16.1042 18.65 17.4625C16.65 18.8208 14.4333 19.5 12 19.5ZM12 17.5C13.8833 17.5 15.6125 17.0042 17.1875 16.0125C18.7625 15.0208 19.9667 13.6833 20.8 12C19.9667 10.3167 18.7625 8.97917 17.1875 7.9875C15.6125 6.99583 13.8833 6.5 12 6.5C10.1167 6.5 8.3875 6.99583 6.8125 7.9875C5.2375 8.97917 4.03333 10.3167 3.2 12C4.03333 13.6833 5.2375 15.0208 6.8125 16.0125C8.3875 17.0042 10.1167 17.5 12 17.5Z"
                      fill="#4C4D52"
                    />
                  </g>
                </svg>
              </div>
              <div className="login-right-bottom-d5">
                <div className="login-keep-me-loggedin">
                  <input type="checkbox" />
                  <span>Keep me Logged in</span>
                </div>
                {/* <span className="login-forg-pass">Forgot Password?</span> */}
              </div>
            </div>
            <button
              className="login-btn"

              // onClick={() => onLogin(email, password)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="login-modal-cont"></div>
      {/* {showModal && (
        <FirstTimeLogInfo
          setShowModal={setShowModal}
          setIsLoginOpen={setIsLoginOpen}
          initChakra={initChakra}
        />
      )} */}
    </form>
  );
}

export default Login;
