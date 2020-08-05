import { SHOW_PATIENT_MODAL, HIDE_PATIENT_MODAL } from "./types";

//SHOW MODAL
export const showPatientModal = (modalMode, modalProps) => (dispatch) => {
    dispatch({
        type: SHOW_PATIENT_MODAL,
        modalMode: modalMode,
        modalProps: modalProps,
    });
};

//HIDE MODAL
export const hidePatientModal = () => (dispatch) => {
    dispatch({
        type: HIDE_PATIENT_MODAL,
        modalMode: "",
        modalProps: null,
    });
};
