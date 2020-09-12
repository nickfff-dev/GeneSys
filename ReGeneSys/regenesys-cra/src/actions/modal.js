import { SHOW_MODAL, HIDE_MODAL } from "./types";
// import { SHOW_PATIENT_MODAL, HIDE_PATIENT_MODAL } from "./types";

//SHOW MODAL
export const showModal = (modalMode, modalProps) => (dispatch) => {
    dispatch({
        type: SHOW_MODAL,
        modalMode: modalMode,
        modalProps: modalProps,
    });
};

//HIDE MODAL
export const hideModal = () => (dispatch) => {
    dispatch({
        type: HIDE_MODAL,
        modalMode: "",
        modalProps: null,
    });
};
