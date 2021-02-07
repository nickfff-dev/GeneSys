import { GET_PATIENT, GET_PATIENTS, DISCHARGE_PATIENT, ADD_PATIENT, EDIT_PATIENT, FILTER_PATIENTS } from "../actions/types.js";

const initialState = {
    patient: {},
    patients: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PATIENT:
            return {
                ...state,
                patient: action.payload,
            };
        case GET_PATIENTS:
            return {
                ...state,
                patients: action.payload,
            };
        case DISCHARGE_PATIENT:
            return {
                ...state,
                patients: state.patients.filter((patient) => patient.patientId !== action.payload.patientId),
            };
        case ADD_PATIENT:
            return {
                ...state,
                patients: [...state.patients, action.payload],
            };
        case EDIT_PATIENT:
            return {
                ...state,
                patients: state.patients.map((patient) => (patient.patientId === action.payload.patientId ? action.payload : patient)),
            };
        case FILTER_PATIENTS:
            return{
                ...state,
                globalFilter: action.payload
            }
        default:
            return state;
    }
}
