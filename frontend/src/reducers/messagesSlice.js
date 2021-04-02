import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        createMessage: {
            reducer(state, action) {
                return (state = action.payload);
            },
            prepare(msg) {
                return {
                    payload: msg,
                };
            },
        },
    },
});

export const { createMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
