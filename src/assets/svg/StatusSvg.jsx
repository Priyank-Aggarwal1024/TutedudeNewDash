import * as React from "react";
const StatusSvg = ({ fill1, fill2, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    {...props}
  >
    <circle cx={9.5} cy={9.5} r={9} fill={fill1} fillOpacity={0.39} />
    <circle cx={9.5} cy={9.5} r={6} fill={fill2} />
  </svg>
);
export default StatusSvg;
