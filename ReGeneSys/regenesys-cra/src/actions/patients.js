import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_PATIENTS, DELETE_PATIENT, ADD_PATIENT, EDIT_PATIENT, DISCHARGE_PATIENT } from "./types";
import { PATIENT_API } from "../constants";
import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "./utils";

//GET PATIENTS
export const getPatients = () => (dispatch, getState) => {
    axios
        .get(PATIENT_API, tokenConfig(getState))
        .then((res) => {
            console.log(res.data);
            dispatch({
                type: GET_PATIENTS,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE PATIENT
export const deletePatient = (patientID) => (dispatch, getState) => {
    axios
        .delete(PATIENT_API + `${patientID}/`, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ deletePatient: "Patient Deleted" }));
            dispatch({
                type: DELETE_PATIENT,
                payload: patientID,
            });
        })
        .catch((err) => console.log(err));
};
//DISCHARGE PATIENT
export const dischargePatient = (patient) => (dispatch, getState) => {
    axios
        .put(PATIENT_API + `${patient.patientId}/`, camelCaseKeysToSnake(patient), tokenConfig(getState))
        .then((res) => {
            console.log(snakeCaseKeysToCamel(res.data));
            dispatch(createMessage({ dischargePatient: "Patient Discharged" }));
            dispatch({
                type: DISCHARGE_PATIENT,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//ADD PATIENT
export const addPatient = (patient) => (dispatch, getState) => {
    axios
        .post(PATIENT_API, camelCaseKeysToSnake(patient), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addPatient: "Patient Added" }));
            dispatch({
                type: ADD_PATIENT,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//EDIT PATIENT
export const editPatient = (patient) => (dispatch, getState) => {
    axios
        .put(PATIENT_API + `${patient.patientId}/`, camelCaseKeysToSnake(patient), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ editPatient: "Patient Edited" }));
            dispatch({
                type: EDIT_PATIENT,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};
