
const express = require("express");
const router = express.Router();
const QuizResultModel = require("../models_db/quiz_model");

// // API route to fetch quiz results with user details

router.get("/user_data", async (req, res) => {
  try {
    const quizResults = await QuizResultModel.find({})
      .populate("userId", "fullName email")
      .lean();
    
    console.log("Fetched quiz results:", quizResults); // Debugging line
    
    const results = quizResults.map((result) => ({
      userId: result.userId?._id, // Ensure userId exists
      fullName: result.userId?.fullName || "Unknown", // Default to avoid undefined
      email: result.userId?.email || "Unknown",
      examScore: `${result.obtainedMarks} / ${result.totalMarks}`,
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
// router.get("/user_data", async (req, res) => {
//   try {
//     // Fetch quiz results and populate email and fullName from UserModel
//     const quizResults = await QuizResultModel.find({})
//       .populate("userId", "fullName email") // Populate fullName and email from UserModel
//       .lean();

//     // Map the results to the desired structure
//     const results = quizResults.map((result) => ({
//       userId: result.userId._id, // Access the populated userId
//       fullName: result.userId.fullName, // Access fullName from the populated field
//       email: result.userId.email, // Access email from the populated field
//       examScore: `${result.obtainedMarks} / ${result.totalMarks}`,
//     }));

//     res.status(200).json({ results });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });





