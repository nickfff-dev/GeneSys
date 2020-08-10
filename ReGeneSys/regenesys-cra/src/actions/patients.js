import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";
import _ from "lodash";

import { GET_PATIENTS, DELETE_PATIENT, ADD_PATIENT, EDIT_PATIENT } from "./types";
import { PATIENT_API } from "../constants";

//GET PATIENTS
export const getPatients = () => (dispatch, getState) => {
    axios
        .get(PATIENT_API, tokenConfig(getState))
        .then((res) => {
            console.log(res.data)
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
        .put(PATIENT_API + `${patient.patientID}/`, patient, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ dischargePatient: "Patient Discharged" }));
            dispatch({
                type: EDIT_PATIENT,
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

function camelCaseKeysToSnake(obj){
    if (typeof(obj) !== "object") return obj;

    for(var oldName in obj){

        // Camel to underscore
        // var newName = oldName.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
        var newName = _.snakeCase(oldName)

        // Only process if names are different
        if (newName !== oldName) {
            // Check for the old property name to avoid a ReferenceError in strict mode.
            if (obj.hasOwnProperty(oldName)) {
                obj[newName] = obj[oldName];
                delete obj[oldName];
            }
        }

        // Recursion
        if (typeof(obj[newName]) == "object") {
            obj[newName] = camelCaseKeysToSnake(obj[newName]);
        }

    }
    return obj;
}

function snakeCaseKeysToCamel(obj){
    if (typeof(obj) !== "object") return obj;

    for(var oldName in obj){

        // Camel to underscore
        // var newName = oldName.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
        var newName = _.camelCase(oldName)

        // Only process if names are different
        if (newName !== oldName) {
            // Check for the old property name to avoid a ReferenceError in strict mode.
            if (obj.hasOwnProperty(oldName)) {
                obj[newName] = obj[oldName];
                delete obj[oldName];
            }
        }

        // Recursion
        if (typeof(obj[newName]) == "object") {
            obj[newName] = snakeCaseKeysToCamel(obj[newName]);
        }

    }
    return obj;
}
