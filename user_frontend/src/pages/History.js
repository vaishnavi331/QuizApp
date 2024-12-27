

import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import "../css/History.css";
import { API_BASE_URL } from "../config";

const History = () => {
  const [quizResults, setQuizResults] = useState([]);
  const chartRefs = useRef([]);

  const auth = localStorage.getItem("user");
  const authToken = localStorage.getItem("token");
  const userData = JSON.parse(auth);
  const userName = userData?.fullName;

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/quizResults`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz results");
        }

        const responseData = await response.json();

        if (responseData.success) {
          setQuizResults(responseData.quizResults);
          updateCharts(responseData.quizResults);
        } else {
          console.error("Failed to fetch quiz results:", responseData.error);
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    // Fetch quiz results when the component mounts
    fetchQuizResults();
  }, [authToken]);

  const updateCharts = (data) => {
    data.forEach((result, index) => {
      const chartData = {
        labels: ["Correct", "Wrong", "Unattempted"],
        datasets: [
          {
            data: [
              result.correctAnswers,
              result.wrongAnswers,
              result.unansweredQuestions,
            ],
            backgroundColor: ["#4CAF50", "#FF5733", "#A9A9A9"],
            hoverBackgroundColor: ["#4CAF50", "#FF5733", "#A9A9A9"],
          },
        ],
      };

      let canvasRef = chartRefs.current[index];

      if (!canvasRef) {
        canvasRef = document.createElement("canvas");
        chartRefs.current[index] = canvasRef;
      }

      canvasRef.style.width = "300px";
      canvasRef.style.height = "250px";

      const ctx = canvasRef.getContext("2d");

      if (canvasRef.chart) {
        canvasRef.chart.destroy();
      }

      canvasRef.chart = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: {
          aspectRatio: 1,
          responsive: false,
          maintainAspectRatio: false,
        },
      });
    });
  };

  return (
    <div className="container okresult-container">
      <h3 className="text-center">Result History</h3>
      {quizResults.length === 0 ? (
        <p>
          No results available. Please take a quiz to view your result history.
        </p>
      ) : (
        <ul>
          {quizResults.map((result, index) => (
            <li key={result._id} className="list-unstyled">
              <div className="row">
                {auth && userName && <h4 className="mb-4">Name: {userName}</h4>}

                <div className="col-lg-6 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header obtained-header">
                      <h3>Total Analysis</h3>
                    </div>
                    <div className="card-body">
                      <div className="card-text">
                        <h4>Total Questions: {result.totalQuestions}</h4>
                        <h4>Correct Questions: {result.correctAnswers}</h4>
                        <h4>Wrong Questions: {result.wrongAnswers}</h4>
                        <h4>
                          Unanswered Questions: {result.unansweredQuestions}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <h3>Score</h3>
                    </div>
                    <div className="card-body">
                      <div className="card-text text-center">
                        <h4 className="history-text">Obtained marks</h4>
                        <h5>
                          {result.obtainedMarks} / {result.totalMarks}

                        </h5>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
