import { SHOW_MODAL, HIDE_MODAL } from "./types";
// import { SHOW_PATIENT_MODAL, HIDE_PATIENT_MODAL } from "./types";

//SHOW MODAL
export const showModal = (modalMode, modalProps) => (dispatch) => {
    // export const showPatientModal = (modalMode, modalProps) => (dispatch) => {
    dispatch({
        type: SHOW_MODAL,
        // type: SHOW_PATIENT_MODAL,
        modalMode: modalMode,
        modalProps: modalProps,
    });
};

//HIDE MODAL
export const hideModal = () => (dispatch) => {
    // export const hidePatientModal = () => (dispatch) => {
    dispatch({
        type: HIDE_MODAL,
        // type: HIDE_PATIENT_MODAL,
        modalMode: "",
        modalProps: null,
    });
};
