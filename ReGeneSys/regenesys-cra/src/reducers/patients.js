import {
    GET_PATIENTS,
    DELETE_PATIENT,
    ADD_PATIENT,
    EDIT_PATIENT,
} from "../actions/types.js";

const initialState = {
    patients: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PATIENTS:
            return {
                ...state,
                patients: action.payload,
            };
        case DELETE_PATIENT:
            return {
                ...state,
                patients: state.patients.filter(
                    (patient) => patient.patientID !== action.payload
                ),
            };
        case ADD_PATIENT:
            return {
                ...state,
                patients: [...state.patients, action.payload],
            };
        case EDIT_PATIENT:
            return {
                ...state,
                patients: state.patients.map((patient) =>
                    patient.patientID === action.payload.patientID
                        ? action.payload
                        : patient
                ),
            };
        default:
            return state;
    }
}
