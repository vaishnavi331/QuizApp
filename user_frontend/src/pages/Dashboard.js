import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../css/Dashboard.css";

const Dashboard = () => {
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkQuizStatus();
  }, []);

  const checkQuizStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/quizResults`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.quizResults.length > 0) {
          setHasTakenQuiz(true);
        } else {
          setHasTakenQuiz(false);
        }
      } else {
        console.error("Failed to fetch quiz status:", response.status);
        // Handle error if needed
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
      // Handle error if needed
    }
  };

  const handleStartQuiz = () => {
    if (hasTakenQuiz) {
      console.log("User has already taken the quiz. No reattempt allowed.");
    } else {
      navigate("/Quizok", { state: { quizStarted: true } });
    }
  };

  return (
    <div>
      <h2 className="dashboard-title">Instructions</h2>
      <div className="dashboard-container border border-mute">
        <div className="row">
          <table className="table table-bordered border-black">
            <thead>
              <tr>
                <th scope="col">Particulars</th>
                <th scope="col">Specifications</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exam duration</td>
                <td> 20 min</td>
              </tr>
              <tr>
                <td>Exam mode</td>
                <td>Online</td>
              </tr>
              <tr>
                <td>Type and total number of Questions</td>
                <td>
                  Total 10 Questions
                </td>
              </tr>
              <tr>
                <td>Total marks of the exam</td>
                <td>20</td>
              </tr>
              <tr>
                <td>Marking Scheme</td>
                <td>All of the questions will be worth 2 marks</td>
              </tr>
              <tr>
                <td>Section name</td>
                <td>
                  Aptitude
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>

        <div className="start-button">
          <button
            className="btn btn-primary"
            onClick={handleStartQuiz}
            disabled={hasTakenQuiz}
          >
            {hasTakenQuiz ? "Already Submitted" : "START"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
