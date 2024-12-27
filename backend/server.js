

// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const UserModel = require("./models_db/user_model");
const QuestionModel = require("./models_db/questions");
const QuizResultModel = require("./models_db/quiz_model");

const AdminUserModel = require("./admin_models/admin_user_model");
const UserData = require("./admin_models/userdata_model");

const quizRoute = require("./routes_api/quiz_route");
const userRoute = require("./routes_api/user_route");

const adminroute = require("./admin_routes/admin_user_route");
const userdataroute = require("./admin_routes/userdata_route");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGOBD_URL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;


mongoose
  .connect(MONGOBD_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.log("DB connected");
});

app.use(cors());
app.use(bodyParser.json());

app.use(require("./routes_api/user_route"));
app.use(require("./routes_api/quiz_route"));

app.use(require("./admin_routes/admin_user_route"));
app.use(require("./admin_routes/userdata_route"));

app.get("/getQuestion", async (req, res) => {
  try {
    const questions = await QuestionModel.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/", async (req, res) => {
//     res.send("Hello");

// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
