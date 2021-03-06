// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;

import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./features/todos/todosSlice";
import filtersReducer from "./features/filters/filtersSlice";

const store = configureStore({
    reducer: {
        // Define a top-level state field named `todos`, handled by `todosReducer`
        todos: todosReducer,
        filters: filtersReducer,
    },
});

export default store;
