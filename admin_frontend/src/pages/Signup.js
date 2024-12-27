import "../css/Login.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = (event) => {
    event.preventDefault();
    debugger;
    setLoading(true);

    if (!fullName || !email || !password) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const requestData = { fullName: fullName, email: email, password };

    // fetch(`https://mern-gate-app.azurewebsites.net/signup`, {
      fetch(`${API_BASE_URL}/admin_signup`, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(requestData), // Convert requestData to JSON format
    })
      .then((result) => {
        debugger;
        if (result.status === 201) {
          setLoading(false);
          navigate("/Signin");

          Swal.fire({
            icon: "success",
            title: "User successfully registered.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Some error occured.",
        });
      });
  };
  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-5 mt-5">
            <div className="card">
              <div className="card-header">
                <h3 className="loginbox">Registration</h3>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => signup(e)}>
                  <div className="row">
                    <div
                      className="form-outline mb-3"
                      style={{ textAlign: "left" }}
                    >
                      <label className="form-label" for="form3Example2">
                        Full name
                      </label>
                      <input
                        type="text"
                        id="form3Example2"
                        className="form-control"
                        value={fullName}
                        onChange={(ev) => setFullName(ev.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    className="form-outline mb-3"
                    style={{ textAlign: "left" }}
                  >
                    <label className="form-label" for="form3Example3">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="form3Example3"
                      className="form-control"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                    />
                  </div>

                  <div
                    className="form-outline mb-2"
                    style={{ textAlign: "left" }}
                  >
                    <label className="form-label" for="form3Example4">
                      Password
                    </label>
                    <input
                      type="password"
                      id="form3Example4"
                      className="form-control"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                    />
                  </div>

                  {loading ? (
                    <div className="col-md-12 text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only"></span>
                      </div>
                    </div>
                  ) : null}

                  <button type="submit" className="login-button mb-2">
                    Sign up
                  </button>

                  <div className="text-center">
                    <p className="text-dark">
                      Back to <Link to="/Signin">Login</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
