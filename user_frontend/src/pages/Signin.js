import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
// import axios from "axios";
import { useDispatch } from "react-redux";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    debugger;
    setLoading(true);

    const requestData = { email, password };

    fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); 
      })
      .then((data) => {
        if (data && data.result && data.result.token) {
          setLoading(false);
          localStorage.setItem("token", data.result.token);
          localStorage.setItem("user", JSON.stringify(data.result.user));
          dispatch({ type: "LOGIN_SUCCESS", payload: data.result.user });
          setLoading(false);
          navigate("/");
        } else {
          throw new Error("Invalid response data format");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: error.message, 
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
                <h3>Login Credentials</h3>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => login(e)}>
                  <div
                    className="form-outline mb-4"
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
                    className="form-outline mb-4"
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

                  {/* <div className="row">
                    {loading ? (
                      <div className="col-md-12 text-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="sr-only"></span>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div> */}

                  {loading ? (
  <div className="col-md-12 text-center">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only"></span>
    </div>
  </div>
) : null}


                  <button type="submit" className=" mb-4 login-button">
                    Login
                  </button>

                  <div className="text-center">
                    <p className="text-dark">
                      Create a new account?<Link to="/Signup">Signup</Link>
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

export default Signin;
