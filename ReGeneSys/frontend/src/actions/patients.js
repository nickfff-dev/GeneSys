import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
    GET_PATIENTS,
    DELETE_PATIENT,
    ADD_PATIENT,
    EDIT_PATIENT,
} from "./types";

//GET PATIENTS
export const getPatients = () => (dispatch, getState) => {
    axios
        .get("/api/patients/", tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_PATIENTS,
                payload: res.data,
            });
        })
        .catch((err) =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

//DELETE PATIENT
export const deletePatient = (patientID) => (dispatch, getState) => {
    axios
        .delete(`/api/patients/${patientID}/`, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ deletePatient: "Patient Deleted" }));
            dispatch({
                type: DELETE_PATIENT,
                payload: patientID,
            });
        })
        .catch((err) => console.log(err));
};

//ADD PATIENT
export const addPatient = (patient) => (dispatch, getState) => {
    axios
        .post("/api/patients/", patient, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addPatient: "Patient Added" }));
            dispatch({
                type: ADD_PATIENT,
                payload: res.data,
            });
        })
        .catch((err) =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

//EDIT PATIENT
export const editPatient = (patient) => (dispatch, getState) => {
    axios
        .put(
            `/api/patients/${patient.patientID}/`,
            patient,
            tokenConfig(getState)
        )
        .then((res) => {
            dispatch(createMessage({ editPatient: "Patient Edited" }));
            dispatch({
                type: EDIT_PATIENT,
                payload: res.data,
            });
        })
        .catch((err) =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

//GENERATE ID
