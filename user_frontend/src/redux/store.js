// Import the createStore function from Redux
import { createStore } from 'redux';
// Import the rootReducer, which combines all the application's reducers
import { combineReducer } from './combineReducer';

// Create a Redux store by passing the rootReducer to createStore
export const store = createStore(
    combineReducer
    )

