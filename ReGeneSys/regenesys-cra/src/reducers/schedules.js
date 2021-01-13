import {
    GET_EVENTS,
    DELETE_EVENT,
    ADD_EVENT,
    EDIT_EVENT,
    GET_SCHEDULES,
    GET_SCHEDULED_PATIENTS,
    GET_AVAILABLE_PHYSICIANS,
    CREATE_EVENTSCHEDULE,
    EDIT_EVENTSCHEDULE,
    DELETE_EVENTSCHEDULE,
    LOAD_SCHEDULES,
    GET_AVAILABLE_PATIENTS,
    CREATE_PATIENT_APPOINTMENT,
    GET_PATIENT_APPOINTMENT_DETAILS,
    EDIT_PATIENT_APPOINTMENT,
    DELETE_PATIENT_APPOINTMENT,
    LOAD_OVERLAY,
    UNLOAD_OVERLAY,
    NEW_DATE_SELECTED,
    SCHEDULE_SELECTED,
} from "../actions/types.js";

const initialState = {
    events: [],
    schedules: [],
    selectedAppointment: [],
    scheduledPatients: [],
    availablePatients: [],
    availablePhysicians: [],
    isLoadingSchedules: false,
    isLoadingPatients: false,
    isLoadingOverlay: false,
    newDateSelected: false,
    scheduleSelected: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        //GENERAL
        case LOAD_OVERLAY:
            return {
                ...state,
                isLoadingOverlay: true,
            };
        case UNLOAD_OVERLAY:
            return {
                ...state,
                isLoadingOverlay: false,
            };
        //EVENTS
        case GET_EVENTS:
            return {
                ...state,
                events: action.payload,
                isLoadingEvents: false,
            };
        case DELETE_EVENT:
            return {
                ...state,
                events: state.events.filter((event) => event.eventId !== action.payload),
            };
        case ADD_EVENT:
            return {
                ...state,
                events: [...state.events, action.payload],
            };
        case EDIT_EVENT:
            return {
                ...state,
                events: state.events.map((event) => (event.eventId === action.payload.eventId ? action.payload : event)),
            };
        //SCHEDULES
        case LOAD_SCHEDULES:
            return {
                ...state,
                isLoadingSchedules: true,
            };
        case GET_SCHEDULES:
            return {
                ...state,
                schedules: action.payload,
                patients: [],
                scheduledPatients: [],
                isLoadingSchedules: false,
            };
        case CREATE_EVENTSCHEDULE:
            return {
                ...state,
                schedules: [...state.schedules, action.payload],
            };
        case EDIT_EVENTSCHEDULE:
            return {
                ...state,
                schedules: state.schedules.map((schedule) => (schedule.pk === action.payload.pk ? action.payload : schedule.pk)),
            };
        case DELETE_EVENTSCHEDULE:
            return {
                ...state,
                schedules: state.schedules.filter((schedule) => schedule.pk !== action.payload.pk),
                isLoadingSchedules: false,
            };
        case GET_AVAILABLE_PHYSICIANS:
            return {
                ...state,
                availablePhysicians: action.payload,
            };
        case CREATE_PATIENT_APPOINTMENT:
            return {
                ...state,
                scheduledPatients: [...state.scheduledPatients, action.payload],
            };
        case EDIT_PATIENT_APPOINTMENT:
            console.log(action.payload.pk)
            return {
                ...state,
                scheduledPatients: state.scheduledPatients.map((scheduledPatient) => (scheduledPatient.pk === action.payload.pk ? action.payload : scheduledPatient)),
            };
        case DELETE_PATIENT_APPOINTMENT:
            return {
                ...state,
                scheduledPatients: state.scheduledPatients.filter((scheduledPatients) => scheduledPatients.pk !== action.payload),
            };
        case NEW_DATE_SELECTED:
            return{
                ...state,
                newDateSelected: action.payload,
                scheduleSelected: false
            };
        case SCHEDULE_SELECTED:
            return{
                ...state,
                scheduleSelected:action.payload
            }
        //PATIENTS
        case GET_SCHEDULED_PATIENTS:
            return {
                ...state,
                scheduledPatients: action.payload,
                isLoadingPatients: false,
            };
        case GET_AVAILABLE_PATIENTS:
            return {
                ...state,
                availablePatients: action.payload,
                isLoadingPatients: false,
            };
        case GET_PATIENT_APPOINTMENT_DETAILS:
            return {
                ...state,
                selectedAppointment: action.payload,
                isLoadingOverlay: false
            };
        default:
            return state;
    }
}
