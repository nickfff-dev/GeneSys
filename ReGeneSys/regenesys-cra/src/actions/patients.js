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
            dispatch({
                type: GET_PATIENTS,
                payload: res.data,
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
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//ADD PATIENT
export const addPatient = (patient) => (dispatch, getState) => {
    // for (var [index, value] of Object.keys(patient).entries()) {
    //     if (value === "contact" || value === "clinical") {
    //         for (var [index2, value2] of Object.keys(patient[value]).entries()) {
    //             value2 = _.snakeCase(value2);
    //             console.log(value2);
    //         }
    //     }
    //     value = _.snakeCase(value);
    //     console.log(value);
    // }

    // var snakeCase =

    // const camelCaseArray = snakeCaseArray.map(item=>{
    //     return Object.keys(item).map(key=>{
    //        const newKeyName = _.camelCase(key) /*---> lodash function*/
    //        return {[newKeyName]:item[key]}
    //     })

    console.log(snakeCase(patient));

    axios
        .post(PATIENT_API, snakeCase(patient), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addPatient: "Patient Added" }));
            dispatch({
                type: ADD_PATIENT,
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//EDIT PATIENT
export const editPatient = (patient) => (dispatch, getState) => {
    axios
        .put(PATIENT_API + `${patient.patientID}/`, patient, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ editPatient: "Patient Edited" }));
            dispatch({
                type: EDIT_PATIENT,
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

function snakeCase(data) {
    for (var [index, value] of Object.keys(data).entries()) {
        if (value === "contact" || value === "clinical") {
            for (var [index2, value2] of Object.keys(data[value]).entries()) {
                value2 = _.snakeCase(value2);
                // console.log(data[value][value2]);
            }
        }
        value = _.snakeCase(value);
        // console.log(data[value]);
    }
    return data;
}
