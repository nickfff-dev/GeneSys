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
} from "../actions/types.js";

const initialState = {
    events: [],
    schedules: [],
    patients: [],
    availablePhysicians: [],
    isLoadingEvents: false,
    isLoadingSchedules: false,
    isLoadingPatients: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
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
                schedules: state.schedules.map((schedule) => (schedule.pk === action.payload.pk ? action.payload : schedule)),
            };
        case DELETE_EVENTSCHEDULE:
            return {
                ...state,
                schedules: state.schedules.filter((schedule) => schedule.pk !== action.payload),
                isLoadingSchedules: false,
            };
        case GET_AVAILABLE_PHYSICIANS:
            return {
                ...state,
                availablePhysicians: action.payload,
            };

        //PATIENTS
        case GET_SCHEDULED_PATIENTS:
            return {
                ...state,
                patients: action.payload,
                isLoadingPatients: false,
            };
        default:
            return state;
    }
}
