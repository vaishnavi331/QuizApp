import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./pages/Navbar";  
import Quizok from "./pages/Quizok";   // quiz
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";   // instructions
import Home from "./pages/Home";
import Success from "./pages/Success";   // results
import QuestionGraph from "./pages/QuestionGraph";   //after exam
import History from "./pages/History";    // 2 result boxes


const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? element : <Navigate to="/Signin" />;
};

function App() {

  const [examRunning, setExamRunning] = useState(false);


  return (
    <div className="App">
   
      <Router>
      <Navbar examRunning={examRunning} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Signup" element={<Signup />} />
          
          <Route
            path="/Dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route path="/Quizok" element={<PrivateRoute element={<Quizok setExamRunning={setExamRunning} />} />} />
          <Route
            path="/Success"
            element={<PrivateRoute element={<Success />} />}
          />
          <Route
            path="/QuestionGraph"
            element={<PrivateRoute element={<QuestionGraph />} />}
          />
          <Route
            path="/History"
            element={<PrivateRoute element={<History />} />}
          />
         
        </Routes>
      </Router>
    </div>
  );
}

export default App;
