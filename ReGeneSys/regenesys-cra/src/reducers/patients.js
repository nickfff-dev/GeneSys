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

// import { createSlice } from "@reduxjs/toolkit";
// import { PATIENT_API } from "../constants";
// import { tokenConfig } from "../actions/auth";
// import { createMessage, returnErrors } from "../actions/messages";
// import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "../actions/utils";

// import axios from "axios";

// const initialState = {
//     patient: "",
//     patients: [],
//     globalFilter: "",
// };

// const patients = createSlice({
//     name: "patients",
//     initialState,
//     reducers: {
//         //GET PATIENT INFO
//         patientGet(state, action) {
//             state.patient = action.payload;
//         },
//         //GET ALL PATIENTS
//         patientsGet(state, action) {
//             // return {
//             // ...state,
//             // patients: action.payload,
//             state.patients = action.payload;
//             // };
//         },
//         patientAdd(state, action) {
//             state.patients = [...state.patients, action.payload];
//         },
//         patientEdit(state, action) {
//             // return {
//             // ...state,
//             state.patients = state.patients.map((patient) => (patient.patientId === action.payload.patientId ? action.payload : patient));
//             // };
//         },
//         patientDischarge(state, action) {
//             // return {
//             // ...state,
//             state.patients = state.patients.map((patient) => (patient.patientId === action.payload.patientId ? action.payload : patient));
//             // };
//         },
//         //SEARCH PATIENT
//         patientsSearch(state, action) {
//             return {
//                 ...state,
//                 patients: action.payload,
//             };
//         },
//         //SETS TABLE FILTER
//         // filterPatients: {
//         //     //serves as reducer
//         //     reducer(state, action) {
//         //         return {
//         //             ...state,
//         //             globalFilter: action.payload,
//         //         };
//         //     },
//         //     //serves as actions
//         //     prepare(globalFilter) {
//         //         return {
//         //             payload: globalFilter,
//         //         };
//         //     },
//         // },

//         // todoToggled(state, action) {
//         //     const todo = state.find((todo) => todo.id === action.payload);
//         //     todo.completed = !todo.completed;
//         // },
//         // todosLoading(state, action) {
//         //     return {
//         //         ...state,
//         //         status: "loading",
//         //     };
//         // },
//     },
// });

// export const { patientGet, patientsGet, patientsSearch, patientAdd, patientEdit, patientDischarge, filterPatients } = patients.actions;

// export default patients.reducer;

// export const getPatients = () => async (dispatch, getState) => {
//     try {
//         const res = await axios.get(PATIENT_API, tokenConfig(getState));
//         dispatch(patientsGet(snakeCaseKeysToCamel(res.data)));
//     } catch (err) {
//         dispatch(returnErrors(err.response.data, err.response.status));
//     }
// };

// export const searchPatients = (searchValue) => async (dispatch, getState) => {
//     try {
//         const res = await axios.get(PATIENT_API + `search_patients/?query=${searchValue}`, tokenConfig(getState));
//         dispatch(patientsSearch(snakeCaseKeysToCamel(res.data)));
//     } catch (err) {
//         dispatch(returnErrors(err.response.data, err.response.status));
//     }
// };

// export const getPatient = (patientId) => async (dispatch, getState) => {
//     try {
//         const res = await axios.get(PATIENT_API + `${patientId}/`, tokenConfig(getState));
//         dispatch(patientGet(snakeCaseKeysToCamel(res.data)));
//     } catch (err) {
//         dispatch(returnErrors(err.response.data, err.response.status));
//     }
// };

// //ADD PATIENT
// export const addPatient = (patient) => async (dispatch, getState) => {
//     try {
//         const res = await axios.post(PATIENT_API, camelCaseKeysToSnake(patient), tokenConfig(getState));
//         dispatch(createMessage({ addPatient: "Patient Added" }));
//         dispatch(patientAdd(snakeCaseKeysToCamel(res.data)));
//     } catch (err) {
//         dispatch(returnErrors(err.response.data, err.response.status));
//     }
//     // axios
//     //     .post(PATIENT_API, camelCaseKeysToSnake(patient), tokenConfig(getState))
//     //     .then((res) => {
//     //         dispatch(createMessage({ addPatient: "Patient Added" }));
//     //         dispatch({
//     //             type: ADD_PATIENT,
//     //             payload: snakeCaseKeysToCamel(res.data),
//     //         });
//     //     })
//     //     .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
// };

// //EDIT PATIENT
// export const editPatient = (patient) => async (dispatch, getState) => {
//     try {
//         const res = await axios.put(PATIENT_API + `${patient.patientId}/`, camelCaseKeysToSnake(patient), tokenConfig(getState));
//         dispatch(createMessage({ editPatient: "Patient Edited" }));
//         dispatch(patientEdit(snakeCaseKeysToCamel(res.data)));
//     } catch (err) {
//         dispatch(returnErrors(err.response.data, err.response.status));
//     }
// };

// //DISCHARGE PATIENT
// export const dischargePatient = (patient) => async (dispatch, getState) => {
//     try {
//         const res = await axios.put(PATIENT_API + `${patient.patientId}/`, camelCaseKeysToSnake(patient), tokenConfig(getState));
//         dispatch(createMessage({ dischargePatient: "Patient Discharged" }));
//         dispatch(patientDischarge(snakeCaseKeysToCamel(res.data)));
//     } catch (err) {
//         dispatch(returnErrors(err.response.data, err.response.status));
//     }
// };

// //FILTER PATIENT TABLE
// export const filterPatients = (globalFilter) => (dispatch, getState) => {
//     dispatch(patientFilter(globalFilter));
// };
