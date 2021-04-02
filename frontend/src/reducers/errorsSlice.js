import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    msg: {},
    status: null,
};

const errorsSlice = createSlice({
    name: "errors",
    initialState,
    reducers: {
        returnErrors: {
            reducer(state, action) {
                return {
                    ...state,
                    msg: action.payload.msg.detail,
                    status: action.payload.status,
                };
            },
            prepare(msg, status) {
                return {
                    payload: { msg, status },
                };
            },
        },
    },
});

export const { returnErrors } = errorsSlice.actions;
export default errorsSlice.reducer;

// export const returnErrors = (msg, status) => {
//     return {
//         type: GET_ERRORS,
//         payload: { msg, status },
//     };
// };
