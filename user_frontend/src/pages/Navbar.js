import React, { useState, useEffect } from "react";
import "../css/Navbar.css";
import { useNavigate } from "react-router-dom";


const Navbar = () => {

  const auth = localStorage.getItem("user");
  const userData = JSON.parse(auth);
  const userName = userData?.fullName;

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/Signup");
  };

  // // State to track if the page is in full-screen mode
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Event listener to update full-screen state
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      // Cleanup event listener
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleFullScreenChange = () => {
    setIsFullScreen(document.fullscreenElement !== null);
  };

  // Conditionally render the navbar based on full-screen state
  if (isFullScreen) {
    return null;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark nav-background fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand text-dark gate-exam" href="/">
           Quiz App
          </a>
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
              <li className="nav-item">
                <a className="nav-link" href="/Dashboard">
                  Dashboard
                </a>
              </li>
            </ul>

            <div className="user-info dropdown nav-item">
              {auth && userName && (
                <span
                  className="nav-link user-name dropdown-toggle text-dark"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="user-welcome"> {userName}</span>
                </span>
              )}
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="/History">
                    Result History
                  </a>
                </li>
                {/* <li>
                  <a className="dropdown-item" href="/QuestionBreakdown">
                    Each Question History
                  </a>
                </li> */}
              </ul>
            </div>

            {auth ? (
              <div className="sign-button">
                <a className="nav-link" href="/Signup" onClick={logout}>
                  Logout
                </a>
              </div>
            ) : (
              <>
                <div className="sign-button">
                  <a className="nav-link" href="/Signin">
                    Signup & Login
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;





