// Import necessary Redux functions and reducers
import { combineReducers } from 'redux';
import { userReducer } from './userReducer';   // Import the user reducer


// Export the created Redux store
export const combineReducer = combineReducers({
    userReducer: userReducer,  // Assign the userReducer to the 'user' state slice
  });
