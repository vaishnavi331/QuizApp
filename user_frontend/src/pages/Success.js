import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Chart from "chart.js/auto";
import "../css/Success.css";

const Success = () => {
  const location = useLocation();
  const quizResults = location.state?.quizResults;
  const chartRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    let currentChartRef = chartRef.current;

    if (currentChartRef && quizResults && quizResults.success) {
      const ctx = currentChartRef.getContext("2d");

      // Check if there's an existing chart instance
      if (currentChartRef.chart) {
        // Destroy the existing chart before creating a new one
        currentChartRef.chart.destroy();
      }

      // Prepare data for the pie chart
      const data = {
        labels: ["Correct Answers", "Wrong Answers", "Unattempted Questions"],
        datasets: [
          {
            data: [
              quizResults.correctAnswers,
              quizResults.wrongAnswers,
              quizResults.unansweredQuestions,
            ],
            backgroundColor: ["#4CAF50", "#FF5733", "#A9A9A9"],
          },
        ],
      };

      currentChartRef.chart = new Chart(ctx, {
        type: "pie",
        data: data,
        options: {
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const label = data.labels[tooltipItem.index];
                const value =
                  data.datasets[tooltipItem.datasetIndex].data[
                    tooltipItem.index
                  ];
                return `${label}: ${value}\n`; // Add '\n' for a new line
              },
            },
          },
          responsive: false, // Disable responsiveness
        },
      });
    }
  }, [quizResults]); // Add chartRef.current to the dependency array

  const handleShowAllq = () => {
    // Navigate to the Allq component
    navigate("/QuestionGraph", { state: { quizResults } });
  };

  if (!quizResults) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container success-container">
      <div className="row">
        {/* <div className="col-sm-12 col-md-4">
          <div className="card mb-4" style={{ height: "60vh" }}>
            <div className="card-header">
              <h2>Answers Evaluation</h2>
            </div>
            <div className="card-body">
              {quizResults.success ? (
                <div>
                  <canvas ref={chartRef} width="300" height="250"></canvas>

                  <div className="card-text"></div>
                </div>
              ) : (
                <p>Failed to fetch quiz results.</p>
              )}
            </div>
          </div>
        </div> */}

        <div className="col-sm-12 col-md-4">
          <div className="card mb-4  obtained-card" style={{ height: "60vh" }}>
            <div className="card-header obtained-header">
              <h2>Results</h2>
            </div>
            <div className="card-body obtained-body text-center">
              <h4 className="obtained-marks">Obtained Marks</h4>
              <div className="card-text">
                <p className="marks">
                  {quizResults.obtainedMarks} / {quizResults.totalMarks}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-md-4">
          <div className="card mb-4" style={{ height: "60vh" }}>
            <div className="card-header">
              <h2>Total Analysis</h2>
            </div>
            <div className="card-body">
              <div className="card-text">
                <p className=" total-analysis">
                  Total Questions: {quizResults.totalQuestions}
                </p>
                <p className=" total-analysis">
                  Correct Answers: {quizResults.correctAnswers}
                </p>
                <p className=" total-analysis">
                  Wrong Answers: {quizResults.wrongAnswers}
                </p>
                <p className=" total-analysis">
                  Unattempted Questions: {quizResults.unansweredQuestions}
                </p>
                {/* <p className=" total-analysis">Score: {quizResults.score}</p> */}
                <p className=" total-analysis">
                  Obtained Marks: {quizResults.obtainedMarks}
                </p>
                <p className=" total-analysis">
                  Total Marks: {quizResults.totalMarks}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleShowAllq}>
          Questions Evaluation
        </button>
      </div>
      <Link to="/Dashboard">Home</Link>
    </div>
  );
};

export default Success;
