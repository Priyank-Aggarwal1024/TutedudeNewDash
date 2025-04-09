import { DownSvg, logo, logoSmall, ThreeDotSvg } from "@/assets";
import "@/assets/styles/Navbar.css";
import { NavLink } from "react-router-dom";
import { NAV_LIST } from "@/constant";
import { useSelector } from "react-redux";
import React from "react";
function Navbar() {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="bg-white navbar flex justify-between items-center">
      <div className="navbar-logo">
        <img src={logo} alt="logo" className="navbar-logo-large" />
        <img src={logoSmall} alt="logo" className="navbar-logo-small" />
      </div>
      <div className="navbar-right">
        <div className="navbar-threedot">
          <ThreeDotSvg />
        </div>
        <div className="navbar-list">
          {NAV_LIST.map((item, index) => (
            <React.Fragment key={item.id}>
              {index !== 0 && (
                <div className="navbar-list-item-vertical-line"></div>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "navbar-list-item active" : "navbar-list-item"
                }
              >
                {item.name}
              </NavLink>
            </React.Fragment>
          ))}
        </div>
        <div className="navbar-user">
          <div className="navbar-user-name flex justify-center items-center">
            {user.name}
          </div>
          <DownSvg />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
