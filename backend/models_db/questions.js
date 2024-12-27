const mongoose = require("mongoose");

let highestTime = 0;

const questionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  question: String,
  options: [String],
  correctAnswer: String,
  marks: { type: Number, default: 1 }, 
  type: { type: String, enum: ["options", "input"], default: "options" }, 
});

const QuestionModel = mongoose.model("QuestionModel", questionSchema);

module.exports = QuestionModel;

const data = [
  {
    "question":
      "The _________ is too high for it to be considered _________.",
    options: [
      "fair / fare",
      "faer / fair",
      "fare / fare ",
      "fare / fair",
    ],
    correctAnswer: "D",
    marks: 2,
    type: "options",
  },
  {
    question:
      `Given below are four statements.<br><br>
      Statement 1: All students are inquisitive.<br>
      Statement 2: Some students are inquisitive.<br>
      Statement 3: No student is inquisitive.<br>
      Statement 4: Some students are not inquisitive.<br><br>
      From the given four statements, find the two statements that CANNOT BE
      TRUE simultaneously, assuming that there is at least one student in the class.`,
    
    options: [
      `Statement 1 and Statement 3`,
      `Statement 1 and Statement 2`,
      `Statement 2 and Statement 4`,
      `Statement 3 and Statement 4`
    ],
    correctAnswer: "A",
    marks: 2,
    type: "options",
  },
  {
    question:
      `The unruly crowd demanded that the accused be _____________ without trial.`,
    
    options: [
      `hanged`,
      `hanging`,
      `hankering`,
      `hung`
    ],
    correctAnswer: "A",
    marks: 2,
    type: "options",
  },
  {
    question:
      "Some people believe that “what gets measured, improves”. Some others believe that “what gets measured, gets gamed”. One possible reason for the difference in the beliefs is the work culture in organizations. In organizations with good work culture, metrics help improve outcomes. However, the same metrics are counterproductive in organizations with poor work culture. <br> Which one of the following is the CORRECT logical inference based on the information in the above passage? ",
    options: [
      "Metrics are useful in organizations with poor work culture",
      "Metrics are useful in organizations with good work culture",
      "Metrics are always counterproductive in organizations with good work culture",
      "Metrics are never useful in organizations with good work culture",
    ],
    correctAnswer: "B",
    marks: 2,
    type: "options",
  },
  {
    question:
      "In a recently conducted national entrance test, boys constituted 65% of those who appeared for the test. Girls constituted the remaining candidates and they accounted for 60% of the qualified candidates. <br> Which one of the following is the correct logical inference based on the information provided in the above passage?",
    options: [
      "Equal number of boys and girls qualified ",
      "Equal number of boys and girls appeared for the test",
      "The number of boys who appeared for the test is less than the number of girls who appeared",
      "The number of boys who qualified the test is less than the number of girls who qualified ",
    ],
    correctAnswer: "D",
    marks: 2,
    type: "options",
  },
  {
    question:
      `The corners and mid-points of the sides of a triangle are named using the distinct letters P, Q, R, S, T and U, but not necessarily in the same order. Consider the following statements: <br> <br> 
       The line joining P and R is parallel to the line joining Q and S.<br> 
       P is placed on the side opposite to the corner T.<br> 
       S and U cannot be placed on the same side <br><br>  Which one of the following statements is correct based on the above information?`,
    options: [
      "P cannot be placed at a corner",
      "S cannot be placed at a corner",
      "U cannot be placed at a mid-point ",
      "R cannot be placed at a corner",
    ],
    correctAnswer: "B",
    marks: 2,
    type: "options",
  },
  {
    question:
      "Archimedes said, “Give me a lever long enough and a fulcrum on which to place it, and I will move the world.” <br>The sentence above is an example of a ___________ statement.",
    options: [
      "figurative",
      "collateral",
      "literal",
      "figurine",
    ],
    correctAnswer: "B",
    marks: 2,
    type: "options",
  },

  {
    question:
      "The mean of the observations of the first 50 observations of a process is 12. If the 51st observation is 18, then, the mean of the first 51 observations of the process, rounded off to two decimal places is ______ .",
    options: ["12.01", "12.12", "12.36", "18.18"],
    correctAnswer: "C",
    marks: 2,
    type: "options",
  },
  
  {
    question:
      "Which among the following typically reduces overfitting in a supervised machine learning algorithm?<br><br> i) Increase model complexity. <br> ii) Reduce model complexity. <br> iii) Increase the number of training points. <br> iv) Reduce the number of training points.",
    options: ["i and ii ", "i, ii and iii", "ii and iii ", "i, ii, iii and iv"],
    correctAnswer: "C",
    marks: 2,
    type: "options",
  },

  {
    question:
      "A binary classification dataset contains only 5% of positive instances. Which one of the following experimental design and performance measures is most suited for measuring the generalizability of a classifier trained on this dataset?",
    options: [
      "fixed training and test sets, accuracy",
      "fixed training and test sets, area under the ROC curve",
      "stratified cross-validation, accuracy ",
      "stratified cross-validation, area under the ROC curve",
    ],
    correctAnswer: "C",
    marks: 2,
    type: "options",
  },


  {
    question:
      "jewsnfjbr",
    options: ["1", "2", "3", "4"],
    correctAnswer: "d",
    marks: 1,
    type: "input",
  },

];

// QuestionModel.insertMany(data);


const insertUniqueQuestions = async (options) => {
  let startTime = Date.now(); // Track start time
  try {
    // Check if questions already exist in the database
    const existingQuestions = await QuestionModel.find({}, 'question');
    const newData = data.filter(newQuestion => !existingQuestions.some(existingQuestion => existingQuestion.question === newQuestion.question));

    if (newData.length === 0) {
      console.log('No new questions to insert');
      return;
    }

    // Insert only unique questions
    const result = await QuestionModel.insertMany(newData, options);
    let endTime = Date.now(); // Track end time
    let elapsedTime = endTime - startTime; // Calculate elapsed time
    console.log(`${result.length} questions inserted successfully in ${elapsedTime} milliseconds`);

    // Update highest time if the current time is higher
    if (elapsedTime > highestTime) {
      highestTime = elapsedTime;
    }
  } catch (error) {
    console.error("Error inserting questions:", error);
  }
};

// Call insertUniqueQuestions function with options
insertUniqueQuestions({ timeout: 60000 }) // Increase timeout to 30 seconds
  .then(() => {
    console.log('Data insertion completed successfully');
    console.log('Highest time taken:', highestTime, 'milliseconds');
  })
  .catch((error) => {
    console.error('Error inserting data:', error);
  });

// let highestTime = 0; // Variable to store the highest time
