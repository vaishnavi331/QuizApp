import React, { useState, useEffect, useRef } from "react";
import "../css/Quiz.css";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Quizok = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [timer, setTimer] = useState(3 * 60 * 60);
  const [timer, setTimer] = useState(60);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [currentQuestionMarks, setCurrentQuestionMarks] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const submitButtonRef = useRef(null);
  const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
    // Check if the quiz has started
    if (location.state && location.state.quizStarted) {
      setQuizStarted(true);
    }
      // Clean up function to exit full-screen mode when the component unmounts
    return () => {
      if (quizStarted) {
        exitFullScreen();
      }
    };
  }, [location.state, quizStarted]);

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  useEffect(() => {
    // Request full-screen mode when the component mounts
    if (quizStarted) {
      requestFullScreen();
    }
  }, [quizStarted]);

  useEffect(() => {
    window.MathJax && window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
  }, [questions, selectedQuestion, selectedOption]);

  useEffect(() => {
    // Check if the user has already taken the quiz when the component mounts
    checkQuizStatus();

    // Add an event listener for handling browser back button clicks
    window.addEventListener("popstate", handlePopstate);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(timerInterval);
          handleTimerComplete();
          return prevTimer;
        } else {
          if (prevTimer <= 30) {
            document.querySelector(".timer-text").classList.add("red");
          } else {
            document.querySelector(".timer-text").classList.remove("red");
          }
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/getQuestion`)
      .then((response) => response.json()) // Parse response as JSON
      .then((data) => {
        setQuestions(data); // Set questions using the parsed JSON data
      })
      .catch((err) => console.log(err));
  }, []);

  const checkQuizStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token retrieved from localStorage:", token);
      const response = await fetch(`${API_BASE_URL}/quizResults`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        response.data &&
        response.data.success &&
        response.data.quizResults.length > 0
      ) {
        // User has already taken the quiz
        setHasTakenQuiz(true);

        // Redirect the user or display a message
        navigate("/dashboard"); // Adjust the path based on your application

        // Display a message or redirect the user if needed
        console.log(
          "User has already taken the quiz. Redirecting or showing a message..."
        );
      } else {
        // User has not taken the quiz
        setHasTakenQuiz(false);
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
    }
  };

  const handlePopstate = () => {
    // Handle browser back button click
    console.log("Browser back button clicked after completing the quiz.");
    navigate("/dashboard");
  };

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
    setSelectedOption(null);

    // Set the marks for the current question
    setCurrentQuestionMarks(questions[index].marks);
  };

  const handleOptionChange = (index) => {
    setSelectedOption(index);
  };

  const handleSaveClick = () => {
    if (selectedQuestion === null) {
      // No question selected
      return;
    }

    const currentQuestion = questions[selectedQuestion];

    // Prepare the response object
    const response = {
      questionId: currentQuestion._id,
      answer: null,
    };

    if (currentQuestion.type === "options") {
      // For questions with options
      if (selectedOption !== null) {
        response.answer = String.fromCharCode(65 + selectedOption);
      }
    } else if (currentQuestion.type === "input") {
      // For input-type questions
      response.answer = inputAnswer.trim();
      // If the answer is empty, mark the question as unattempted
      if (response.answer === "") {
        response.answer = null;
      }
    }

    // Update the questions array with the response
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[selectedQuestion] = {
        ...currentQuestion,
        response,
      };
      return updatedQuestions;
    });

    // Move to the next question if available
    const nextQuestionIndex = selectedQuestion + 1;
    if (nextQuestionIndex < questions.length) {
      handleQuestionClick(nextQuestionIndex);
    } else {
      // Handle the end of the quiz (e.g., show a completion message)
      console.log("All questions saved!");
    }
  };

  const handlePreviousClick = () => {
    const prevQuestionIndex = selectedQuestion - 1;
    if (prevQuestionIndex >= 0) {
      handleQuestionClick(prevQuestionIndex);
    }
  };

  const handleTimerComplete = () => {
    console.log("Timer completed!");

    // Update isQuizCompleted
    setIsQuizCompleted(true);
  };

  useEffect(() => {
    // This effect will run when isQuizCompleted changes
    if (isQuizCompleted) {
      // Perform actions that need to happen when the quiz is completed
      console.log("isQuizCompleted set to true:", isQuizCompleted);

      // Automatically submit the quiz
      handleSubmitClick();
    }
  }, [isQuizCompleted]); // Only run this effect when isQuizCompleted changes

  const handleSubmitClick = () => {
    if (isQuizCompleted && !isSubmitting) {
      setIsSubmitting(true);

      const userResponses = questions.map((question) => ({
        questionId: question._id,
        answer: question.response ? question.response.answer : null,
      }));

      const token = localStorage.getItem("token");
      console.log("Token retrieved from localStorage:", token);

      fetch(`${API_BASE_URL}/submitQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userResponses }),
      })
        .then((response) => {
          console.log("Server response:", response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Quiz results:", data);
          setQuizResults(data);

          // Check if the submission was successful
          if (data.success) {
            // Navigate to the QuizResult component
            navigate("/Success", { state: { quizResults: data } });
          } else {
            // Handle error if the submission was not successful
            console.error("Error submitting quiz:", data.message);
            // You can display an error message to the user if needed
          }
        })
        .catch((error) => {
          console.error("Error submitting quiz:", error);
          // Handle error if needed
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      console.log("Quiz not completed. Please wait until the timer expires.");
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="quiz-background">
      <h5 className="quiz-title">Aptitude Questions</h5>

      <div className="quiz-container border border-mute">
        <div className="row">
          <div className="col-md-8" style={{ textAlign: "left" }}>
            {/* Move the Marks text outside of the div with textAlign: "right" */}
            <div style={{ textAlign: "right" }}></div>
            {currentQuestionMarks !== null && ( // Check if currentQuestionMarks is not null before displaying
              <div style={{ textAlign: "right", fontWeight: "500" }}>
                {currentQuestionMarks} Marks
              </div>
            )}

            {selectedQuestion !== null && (
              <div key={questions[selectedQuestion]._id}>
                {/* Display question number */}
                <div className="question-number questions">
                  Question {selectedQuestion + 1}:
                </div>
                <div className="equation-container">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: questions[selectedQuestion].question,
                    }}
                  />
                </div>
                <br />
                <div className="option-text">
                  {questions[selectedQuestion].type === "options" && (
                    <ul className="option-list">
                      {questions[selectedQuestion].options.map(
                        (option, index) => (
                          <li key={index}>
                            <input
                              type="radio"
                              name="options"
                              checked={selectedOption === index}
                              onChange={() => handleOptionChange(index)}
                            />
                            &nbsp;{option}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                  <br />
                  {questions[selectedQuestion].type === "input" && (
                    <input
                      type="text"
                      value={inputAnswer}
                      onChange={(e) => setInputAnswer(e.target.value)}
                    />
                  )}
                </div>
                <br />
                <div
                  className="btn-toolbar"
                  role="toolbar"
                  aria-label="Toolbar with button groups"
                >
                  <div
                    className="btn-group me-2"
                    role="group"
                    aria-label="First group"
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePreviousClick}
                      disabled={selectedQuestion === 0}
                    >
                      Previous
                    </button>
                  </div>
                  <div
                    className="btn-group me-2"
                    role="group"
                    aria-label="Second group"
                  >
                    <button
                      type="button"
                      className="btn btn-primary savequiz-button"
                      onClick={handleSaveClick}
                    >
                      Save & Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4 secondquiz-column">
            <p className="timer-text">Time Left: {formatTime(timer)} seconds</p>
            <div className="card">
              <div className="card-header">
                <h5 className="text-center">Question List</h5>
              </div>
              <div className="card-body">
                <div className="text-center">
                  {questions.map((question, index) => (
                    <button
                      className="numbers"
                      key={index}
                      onClick={() => handleQuestionClick(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-center">
                {!isSubmitting && (
                  <button
                    className="btn btn-primary mb-3 mt-3"
                    onClick={handleSubmitClick}
                    disabled={timer > 0}
                    ref={submitButtonRef} // Assign the reference to the submit button
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizok;
