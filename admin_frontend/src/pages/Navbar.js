// NAdmin_nvbar.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import Logo from "./img/bg.png";

const Navbar = () => {
  const auth = localStorage.getItem("user");
  const userData = JSON.parse(auth);
  const userName = userData?.fullName;

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark nav-background fixed-top">
        <div className="container-fluid">
          {/* <a className="navbar-brand text-dark gate-exam" href="/">
            <img src={Logo} alt="logoimage" className="logoimg" />
          </a> */}
          <h3 className="navbar-title text-center mx-auto">
            Admin Portal
          </h3>
          <button
            style={{ color: "black" }}
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              
            </ul>
            <div className="user-info dropdown nav-item">
              {userName ? (
                <>
                  <span
                    className="nav-link user-name dropdown-toggle text-dark"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {userName}
                  </span>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="/" onClick={logout}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </>
              ) : (
                <div className="sign-button">
                  <a className="nav-link" href="/signin">
                    Sign In
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
