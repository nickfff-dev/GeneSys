import { SHOW_MODAL, HIDE_MODAL } from "../actions/types.js";
// import { SHOW_PATIENT_MODAL, HIDE_PATIENT_MODAL } from "../actions/types.js";

const initialState = {
    modalMode: "",
    modalProps: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOW_MODAL:
            return {
                ...state,
                modalMode: action.modalMode,
                modalProps: action.modalProps,
            };
        case HIDE_MODAL:
            return {
                ...state,
                modalMode: action.modalMode,
                modalProps: action.modalProps,
            };
        default:
            return state;
    }
}
