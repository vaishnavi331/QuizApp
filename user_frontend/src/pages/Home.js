

import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../css/Home.css";
import { API_BASE_URL } from "../config";

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Fetch total users when component mounts
    fetchTotalUsers();

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

  const fetchTotalUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/totalUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json(); // Parse response body as JSON

      if (
        responseData &&
        responseData.success &&
        responseData.totalUsers !== undefined
      ) {
        setTotalUsers(responseData.totalUsers);
      } else {
        console.error("Invalid response structure:", responseData);
        // Handle the case where the response structure is not as expected
      }
    } catch (error) {
      console.error("Error fetching total users:", error);
      // Handle error if needed
    }
  };

  return (
    <div className="home-container">
      <div className="home-title">Quiz Aptitude Test</div>
      
      <br />
      {isLoggedIn && ( // Render total users count only if logged in
        <h5 className="text-center">
          Total attempted students ( till now ): {totalUsers}
        </h5>
      )}
    </div>
  );
};

export default Home;
