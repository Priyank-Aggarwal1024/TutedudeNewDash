import * as React from "react";
const BackSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={31}
    fill="none"
    {...props}
  >
    <path
      fill="#333"
      d="M7.75 15.501h16.792Zm0 0 5.167-5.166Zm0 0 5.167 5.167Z"
    />
    <path
      stroke="#333"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.676}
      d="M7.75 15.501h16.792m-16.792 0 5.167-5.166M7.75 15.5l5.167 5.167"
    />
  </svg>
);
export default BackSvg;
