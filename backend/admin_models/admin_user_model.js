// Import the mongoose library
const mongoose = require("mongoose");

// Define a schema for the 'UserModel' model
const adminuserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// Create a model 'UserModel' using the defined schema
const AdminUserModel = mongoose.model("AdminUserModel", adminuserSchema);

// Export the 'UserModel' model
// module.exports = UserModel;
