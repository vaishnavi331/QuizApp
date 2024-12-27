const QuestionModel = require("../models_db/questions");
const QuizResultModel = require("../models_db/quiz_model");

// const calculateQuizResults = async (userResponsesArray, userId) => {
//   try {
//     const correctAnswers = await QuestionModel.find(
//       {},
//       { correctAnswer: 1, marks: 1, type: 1 }
//     );

//     let correctScore = 0;
//     let wrongScore = 0;
//     let unansweredQuestions = 0;
//     let totalObtainedMarks = 0;

//     const questionResults = [];

//     userResponsesArray.forEach((userResponse) => {
//       const correctAnswer = correctAnswers.find(
//         (answer) => answer._id.toString() === userResponse.questionId
//       );

//       if (correctAnswer) {
//         if (userResponse.answer !== null) {
//           if (correctAnswer.type === "options") {
//             // Question with options
//             if (correctAnswer.correctAnswer === userResponse.answer) {
//               correctScore++;
//               questionResults.push({
//                 questionId: userResponse.questionId,
//                 correct: true,
//                 wrong: false,
//                 unanswered: false,
//                 marks: correctAnswer.marks,
//               });
//               totalObtainedMarks += correctAnswer.marks;
//             } else {
//               wrongScore++;
//               const negativeMarks =
//                 correctAnswer.marks === 1 ? 1 / 3 : 2 / 3; // Negative marking logic
//               questionResults.push({
//                 questionId: userResponse.questionId,
//                 correct: false,
//                 wrong: true,
//                 unanswered: false,
//                 marks: -negativeMarks,
//               });
//               totalObtainedMarks -= negativeMarks;
//             }
//           } else if (correctAnswer.type === "input") {
//             // Question with an input field
//             const userAnswer = userResponse.answer.toLowerCase().trim();
//             const correctAnswerText = correctAnswer.correctAnswer.toLowerCase().trim();

//             if (userAnswer === correctAnswerText) {
//               correctScore++;
//               questionResults.push({
//                 questionId: userResponse.questionId,
//                 correct: true,
//                 wrong: false,
//                 unanswered: false,
//                 marks: correctAnswer.marks,
//               });
//               totalObtainedMarks += correctAnswer.marks;
//             } else {
//               wrongScore++;
//               const negativeMarks =
//                 correctAnswer.marks === 1 ? 1 / 3 : 2 / 3; // Negative marking logic
//               questionResults.push({
//                 questionId: userResponse.questionId,
//                 correct: false,
//                 wrong: true,
//                 unanswered: false,
//                 marks: -negativeMarks,
//               });
//               totalObtainedMarks -= negativeMarks;
//             }
//           }
//         } else {
//           // Handle unanswered questions for both types
//           unansweredQuestions++;
//           questionResults.push({
//             questionId: userResponse.questionId,
//             correct: false,
//             wrong: false,
//             unanswered: true,
//             marks: 0,
//           });
//         }
//       } else {
//         // Handle unanswered questions for both types
//         unansweredQuestions++;
//         questionResults.push({
//           questionId: userResponse.questionId,
//           correct: false,
//           wrong: false,
//           unanswered: true,
//           marks: 0,
//         });
//       }
//     });

//     const totalQuestions = await QuestionModel.countDocuments();
//     const totalMarks = 100; // Set the total marks for the quiz

//     const quizResult = new QuizResultModel({
//       userId,
//       totalQuestions,
//       correctAnswers: correctScore,
//       wrongAnswers: wrongScore,
//       unansweredQuestions,
//       score: (totalObtainedMarks / totalMarks) * 100, // Calculate percentage based on obtained marks and total marks
//       obtainedMarks: totalObtainedMarks,
//       totalMarks,
//       questionResults,
//     });

//     await quizResult.save();

//     const response = {
//       success: true,
//       totalQuestions,
//       correctAnswers: correctScore,
//       wrongAnswers: wrongScore,
//       unansweredQuestions,
//       // score: (totalObtainedMarks / totalMarks) * 100, 
//       obtainedMarks: totalObtainedMarks,
//       totalMarks,
//       questionResults,
//     };

//     return response;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Internal Server Error");
//   }
// };

// module.exports = { calculateQuizResults, getUserQuizResults, hasUserTakenQuiz, getTotalAttemptedUsers };




const calculateQuizResults = async (userResponsesArray, userId) => {
  try {
    // Fetch correct answers and marks from the database
    const correctAnswers = await QuestionModel.find({}, { correctAnswer: 1 });

    let correctScore = 0;
    let wrongScore = 0;
    let unansweredQuestions = 0;
    let totalObtainedMarks = 0;

    const questionResults = [];

    userResponsesArray.forEach((userResponse) => {
      const question = correctAnswers.find(
        (dbQuestion) => dbQuestion._id.toString() === userResponse.questionId
      );

      if (question) {
        if (userResponse.answer === null) {
          // Unanswered question
          unansweredQuestions++;
          questionResults.push({
            questionId: userResponse.questionId,
            correct: false,
            wrong: false,
            unanswered: true,
            marks: 0,
          });
        } else if (userResponse.answer === question.correctAnswer) {
          // Correct answer
          correctScore++;
          totalObtainedMarks += 2; // Add 2 marks for correct answers
          questionResults.push({
            questionId: userResponse.questionId,
            correct: true,
            wrong: false,
            unanswered: false,
            marks: 2,
          });
        } else {
          // Wrong answer
          wrongScore++;
          questionResults.push({
            questionId: userResponse.questionId,
            correct: false,
            wrong: true,
            unanswered: false,
            marks: 0,
          });
        }
      } else {
        // If question not found in the database
        unansweredQuestions++;
        questionResults.push({
          questionId: userResponse.questionId,
          correct: false,
          wrong: false,
          unanswered: true,
          marks: 0,
        });
      }
    });

    const totalQuestions = await QuestionModel.countDocuments();
    const totalMarks = totalQuestions * 2; // Each question is worth 2 marks

    const quizResult = new QuizResultModel({
      userId,
      totalQuestions,
      correctAnswers: correctScore,
      wrongAnswers: wrongScore,
      unansweredQuestions,
     // score: (totalObtainedMarks / totalMarks) * 100,
      obtainedMarks: totalObtainedMarks,
      totalMarks,
      questionResults,
    });

    await quizResult.save();

    const response = {
      success: true,
      totalQuestions,
      correctAnswers: correctScore,
      wrongAnswers: wrongScore,
      unansweredQuestions,
      score: (totalObtainedMarks / totalMarks) * 100, // Percentage score
      obtainedMarks: totalObtainedMarks,
      totalMarks,
      questionResults,
    };

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};


const getUserQuizResults = async (userId) => {
  try {
    const quizResults = await QuizResultModel.find({ userId });

    return quizResults;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

const hasUserTakenQuiz = async (userId) => {
  try {
    const quizResults = await getUserQuizResults(userId);
    return quizResults.length > 0;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

const getTotalAttemptedUsers = async () => {
  try {
    const totalUsers = await QuizResultModel.countDocuments();
    return totalUsers;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

module.exports = { calculateQuizResults, getUserQuizResults, hasUserTakenQuiz, getTotalAttemptedUsers };