

const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "erdfghjgejdsbhdffg"; // Fallback to a hardcoded secret if .env is not loaded
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");

// Middleware for authentication
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "User not logged in" });
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "").trim();

  // console.log("JWT_SECRET:", JWT_SECRET);
  // console.log("Token received:", token);

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      // Handle token errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      } else {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    const { _id } = payload;

    // Find the user in the database
    UserModel.findById(_id)
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(401).json({ error: "User not found" });
        }
        req.user = dbUser;
        next();
      })
      .catch((err) => {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
};
