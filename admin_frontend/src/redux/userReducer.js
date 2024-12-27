// Define the initial state for the userReducer, with an empty user object
const initialState ={
    user: {}
}
// Define the userReducer function to manage user-related state
export const userReducer = (state = initialState,action)=>{

    // Use a switch statement to handle different action types
    switch(action.type){
        case "LOGIN_SUCCESS":
             // When a "LOGIN_SUCCESS" action is dispatched, update the user state user data
            return{
                ...state,user:action.payload
            };
        case "LOGIN_ERROR":
             // When a "LOGIN_ERROR" action is dispatched, reset the user state to its initial value
            return initialState;

        default:
            return state;
            // For all other action types or the initial state, return the current state
           
    }
};
