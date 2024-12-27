// Allq.js
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Chart from "chart.js/auto";
import "../css/QuestionGraph.css";

const QuestionGraph = () => {
  const location = useLocation();
  const quizResults = location.state?.quizResults;
  const chartRef = useRef();

  useEffect(() => {
    console.log("quizResults:", quizResults);

    if (quizResults && quizResults.success && quizResults.questionResults) {
      console.log("questionResults:", quizResults.questionResults);

      const ctx = chartRef.current.getContext("2d");

      // Check if there's an existing chart instance
      if (chartRef.current.chart) {
        // Destroy the existing chart before creating a new one
        chartRef.current.chart.destroy();
      }

      // Prepare data for the bar graph
      const data = {
        labels: quizResults.questionResults.map(
          (result, index) => `Question ${index + 1}`
        ),
        datasets: [
          {
            label: "Correct",
            data: quizResults.questionResults.map((result) =>
              result.correct ? 1 : 0
            ),
            backgroundColor: "#4CAF50",
            borderWidth: 1,
          },
          {
            label: "Wrong",
            data: quizResults.questionResults.map((result) =>
              result.wrong ? 1 : 0
            ),
            backgroundColor: "#FF5733",
            borderWidth: 1,
          },
          {
            label: "Unattempted",
            data: quizResults.questionResults.map((result) =>
              result.unanswered ? 1 : 0
            ),
            backgroundColor: "#A9A9A9",
            borderWidth: 1,
          },
        ],
      };

      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
          responsive: true, // Disable responsiveness
          maintainAspectRatio: false, // Disable aspect ratio
          // Add other options as needed
        },
      });
    }
  }, [quizResults]);

  if (!quizResults || !quizResults.success || !quizResults.questionResults) {
    return <p>Loading...</p>;
  }
  return (
    <div className="container allq-container">
      <div className="row">
        <div className="col-md-12 col-lg-12 ">
          <div className="card" style={{ height: "90vh" }}>
            <div className="card-header text-center">
              <h2>Answers Evaluation</h2>
            </div>
            <div className="card-body">
              {quizResults.success ? (
                <div>
                  <canvas
                    ref={chartRef}
                    style={{ width: "600px", height: "400px" }}
                  ></canvas>
                </div>
              ) : (
                <p>Failed to fetch quiz results.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionGraph;
