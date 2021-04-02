import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modalMode: "",
    modalProps: [],
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal: {
            reducer(state, action) {
                const { modalMode, modalProps } = action.payload;
                return {
                    ...state,
                    modalMode: modalMode,
                    modalProps: modalProps,
                };
            },
            prepare(modalMode, modalProps) {
                return {
                    payload: { modalMode, modalProps },
                };
            },
        },
        hideModal(state, action) {
            state.modalMode = "";
            state.modalProps = null;
        },
    },
});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
