import { GET_EVENTS, DELETE_EVENT, ADD_EVENT, EDIT_EVENT, GET_SCHEDULES, GET_SCHEDULED_PATIENTS, GET_AVAILABLE_PHYSICIANS } from "../actions/types.js";

const initialState = {
    events: [],
    schedules: [],
    patients: [],
    availablePhysicians: [],
    isLoadingEvents: true,
    isLoadingSchedules: true,
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
        case GET_SCHEDULES:
            return {
                ...state,
                schedules: action.payload,
                patients: [],
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
        // case DELETE_SCHEDULE:
        //     return {
        //         ...state,
        //         schedules: state.schedules.filter((schedule) => schedule.scheduleId !== action.payload),
        //     };
        // case ADD_SCHEDULE:
        //     return {
        //         ...state,
        //         schedules: [...state.schedules, action.payload],
        //     };
        // case EDIT_SCHEDULE:
        //     return {
        //         ...state,
        //         schedules: state.schedules.map((schedule) => (schedule.scheduleId === action.payload.scheduleId ? action.payload : schedule)),
        //     };
        default:
            return state;
    }
}
