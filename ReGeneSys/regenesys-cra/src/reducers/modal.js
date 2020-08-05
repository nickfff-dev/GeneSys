import { SHOW_PATIENT_MODAL, HIDE_PATIENT_MODAL } from "../actions/types.js";

const initialState = {
    modalMode: "",
    modalProps: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOW_PATIENT_MODAL:
            return {
                ...state,
                modalMode: action.modalMode,
                modalProps: action.modalProps,
            };
        case HIDE_PATIENT_MODAL:
            return {
                ...state,
                modalMode: action.modalMode,
                modalProps: action.modalProps,
            };
        default:
            return state;
    }
}
