// import { GET_PATIENT, GET_PATIENTS, DISCHARGE_PATIENT, ADD_PATIENT, EDIT_PATIENT, FILTER_PATIENT_TABLE, SEARCH_PATIENTS } from "../actions/types.js";
// import { createAction } from "@reduxjs/toolkit";

// const initialState = {
//     patient: "",
//     patients: [],
// };

// // export const counter =

// export default function (state = initialState, action) {
//     switch (action.type) {
//         case GET_PATIENT:
//             return {
//                 ...state,
//                 patient: action.payload,
//             };
//         case GET_PATIENTS:
//             return {
//                 ...state,
//                 patients: action.payload,
//             };
//         case DISCHARGE_PATIENT:
//             return {
//                 ...state,
//                 patients: state.patients.filter((patient) => patient.patientId !== action.payload.patientId),
//             };
//         case ADD_PATIENT:
//             return {
//                 ...state,
//                 patients: [...state.patients, action.payload],
//             };
//         case EDIT_PATIENT:
//             return {
//                 ...state,
//                 patients: state.patients.map((patient) => (patient.patientId === action.payload.patientId ? action.payload : patient)),
//             };
//         case FILTER_PATIENT_TABLE:
//             return {
//                 ...state,
//                 globalFilter: action.payload,
//             };
//         case SEARCH_PATIENTS:
//             console.log(action.payload);
//             return {
//                 ...state,
//                 patients: action.payload,
//             };
//         default:
//             return state;
//     }
// }

import { createSlice } from "@reduxjs/toolkit";
import { PATIENT_API } from "../constants";
import { tokenConfig } from "./authSlice";
import { createMessage } from "./messagesSlice";
import { returnErrors } from "./errorsSlice";
import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "../actions/utils";

import axios from "axios";

const initialState = {
    patient: "",
    patients: [],
    globalFilter: "",
    isLoadingPatients: false,
    isLoadingModal: false,
    generatedPatientId: "",
};

const patientsSlice = createSlice({
    name: "patients",
    initialState,
    reducers: {
        //GENERATE ID FOR CREATION
        patientGenerateId(state, action) {
            state.generatedPatientId = action.payload;
        },
        //GET PATIENT INFO
        patientGet(state, action) {
            state.patient = action.payload;
        },
        //GET ALL PATIENTS
        patientsGet(state, action) {
            // return {
            // ...state,
            // patients: action.payload,
            state.patients = action.payload;
            // };
        },
        patientAdd(state, action) {
            state.patients = [...state.patients, action.payload];
        },
        patientEdit(state, action) {
            // return {
            // ...state,
            state.patients = state.patients.map((patient) => (patient.patientId === action.payload.patientId ? action.payload : patient));
            // };
        },
        patientDischarge(state, action) {
            // return {
            // ...state,
            state.patients = state.patients.filter((patient) => patient.patientId !== action.payload);
            // };
        },
        //SEARCH PATIENT
        patientsSearch(state, action) {
            return {
                ...state,
                patients: action.payload,
            };
        },
        //SETS TABLE FILTER
        filterPatients: {
            //serves as reducer
            reducer(state, action) {
                return {
                    ...state,
                    globalFilter: action.payload,
                };
            },
            //serves as actions
            prepare(globalFilter) {
                return {
                    payload: globalFilter,
                };
            },
        },
        toggleLoadingPatients(state) {
            state.isLoadingPatients = !state.isLoadingPatients;
        },
        toggleLoadingModal(state) {
            state.isLoadingModal = !state.isLoadingModal;
        },
    },
});

export const {
    patientGenerateId,
    patientGet,
    patientsGet,
    patientsSearch,
    patientAdd,
    patientEdit,
    patientDischarge,
    filterPatients,
    toggleLoadingPatients,
    toggleLoadingModal,
} = patientsSlice.actions;

export default patientsSlice.reducer;

export const generateId = () => async (dispatch, getState) => {
    try {
        const res = await axios.get(PATIENT_API + "generateid", tokenConfig(getState));
        dispatch(patientGenerateId(res.data));
        dispatch(toggleLoadingModal());
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

export const getPatients = () => async (dispatch, getState) => {
    try {
        dispatch(toggleLoadingPatients());
        const res = await axios.get(PATIENT_API, tokenConfig(getState));
        dispatch(patientsGet(snakeCaseKeysToCamel(res.data)));
        dispatch(toggleLoadingPatients());
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

export const searchPatients = (searchValue) => async (dispatch, getState) => {
    try {
        dispatch(toggleLoadingPatients());
        const res = await axios.get(PATIENT_API + `search_patients/?query=${searchValue}`, tokenConfig(getState));
        dispatch(patientsSearch(snakeCaseKeysToCamel(res.data)));
        dispatch(toggleLoadingPatients());
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

export const getPatient = (patientId) => async (dispatch, getState) => {
    try {
        const res = await axios.get(PATIENT_API + `${patientId}/`, tokenConfig(getState));
        dispatch(patientGet(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
    dispatch(toggleLoadingModal());
};

//ADD PATIENT
export const addPatient = (patient) => async (dispatch, getState) => {
    try {
        const res = await axios.post(PATIENT_API, camelCaseKeysToSnake(patient), tokenConfig(getState));
        dispatch(createMessage({ addPatient: "Patient Added" }));
        // dispatch(getPatients());
        // dispatch(loadingModal());
        dispatch(patientAdd(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//EDIT PATIENT
export const editPatient = (patient) => async (dispatch, getState) => {
    try {
        const res = await axios.put(PATIENT_API + `${patient.patientId}/`, camelCaseKeysToSnake(patient), tokenConfig(getState));
        dispatch(createMessage({ editPatient: "Patient Edited" }));
        dispatch(patientEdit(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//DISCHARGE PATIENT
export const dischargePatient = (patient) => async (dispatch, getState) => {
    const { patientId } = patient;
    try {
        const res = await axios.put(PATIENT_API + `discharge_patient/`, camelCaseKeysToSnake(patient), tokenConfig(getState));
        dispatch(createMessage({ dischargePatient: res.data }));
        dispatch(patientDischarge(patientId));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//DELETE PATIENT
export const deletePatient = (patientId) => async (dispatch, getState) => {
    try {
        const res = await axios.delete(PATIENT_API + `${patientId}/`, tokenConfig(getState));
        dispatch(createMessage({ deletePatient: "Patient Deleted" }));
        dispatch(patientDischarge(patientId));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

// //FILTER PATIENT TABLE
// export const filterPatients = (globalFilter) => (dispatch, getState) => {
//     dispatch(patientFilter(globalFilter));
// };
