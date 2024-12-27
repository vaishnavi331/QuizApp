import React, { useState, useEffect } from "react";
import "../css/Userdata.css";
import { API_BASE_URL } from "../config";

const Userdata = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user_data`);
        const data = await response.json();
        console.log("Fetched candidates:", data);
        
        // Set candidates to the correct array from the API response
        setCandidates(data.results); 
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="candidate-data-container">
      <h3 className="text-center pb-3 userdata">User Data</h3>
      <div className="table-responsive">
        <table className="table table-bordered candidate-table">
          <thead className="table-header">
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email ID</th>
              <th>Exam Score</th>
            </tr>
          </thead>
          <tbody className="fieldscolor">
            {candidates.map((candidate) => (
              <tr key={candidate.userId}> 
                <td>{candidate.userId}</td> 
                <td>{candidate.fullName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.examScore}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Userdata;
