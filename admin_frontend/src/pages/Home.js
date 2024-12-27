// Home.js

import React, { useState, useEffect } from "react";
import "../css/Home.css";
import Candidates from "./img/candidate.png";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check login status when component mounts
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="home-container1 container-fluid">


      <div className="row image-section pb-5">
        <div className="col-md-6 col-sm-12 d-flex flex-column justify-content-center px-5">
          <h1 className="pb-3">For Candidates...</h1>

          <h4 className="image-description1">
            "If opportunity doesn't knock,{" "}
            <i className="itag-color">build a door</i>."
            <h6 className="mx-5 mt-3">- Milton Berle, comedian </h6>
          </h4>
          <div className="two-buttons">
            <button className="btn btn-success">
              <a href="/Userdata">More</a>
            </button>
          </div>
        </div>

        <div className="col-md-6 col-sm-12 d-flex justify-content-center p-3 logo-img">
          <img src={Candidates} alt="Background" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default Home;
