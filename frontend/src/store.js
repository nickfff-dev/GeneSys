// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware, )));

// export default store;

import { configureStore } from "@reduxjs/toolkit";

import patientsReducer from "./reducers/patientsSlice";
import messagesReducer from "./reducers/messagesSlice";
import errorsReducer from "./reducers/errorsSlice";
// import auth from "./reducers/auth";
import modalReducer from "./reducers/modalSlice";
import schedulesReducer from "./reducers/schedulesSlice";
// import schedules from "./reducers/schedules";
import authReducer from "./reducers/authSlice";

const store = configureStore({
    reducer: {
        // Define a top-level state field named `patients`, handled by `patientsReducer`
        auth: authReducer,
        patients: patientsReducer,
        modal: modalReducer,
        errors: errorsReducer,
        messages: messagesReducer,
        schedules: schedulesReducer,
        // schedules,
    },
});

export default store;
