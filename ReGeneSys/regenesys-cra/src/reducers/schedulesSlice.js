import { createSlice } from "@reduxjs/toolkit";

import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "../actions/utils";
import { createMessage } from "../reducers/messagesSlice";
import { returnErrors } from "../reducers/errorsSlice";
import { tokenConfig } from "../reducers/authSlice";

import { EVENT_API, GET_SCHEDULE_API, SCHEDULED_PATIENTS_API, SCHEDULE_API } from "../constants";

import axios from "axios";

const initialState = {
    events: [],
    // schedules: [],
    selectedSchedule: [],
    selectedAppointment: [],
    scheduledPatients: [],
    availablePatients: [],
    availablePhysicians: [],
    isLoadingSchedules: false,
    isLoadingPatients: false,
    isLoadingOverlay: false,
    newDateSelected: false,
    selectedSchedulePhysician: null,
};

const schedulesSlice = createSlice({
    name: "schedules",
    initialState,
    reducers: {
        //GENERAL
        showOverlay(state) {
            state.isLoadingOverlay = true;
        },
        hideOverlay(state) {
            state.isLoadingOverlay = false;
        },

        //EVENTS
        schedulesGetEvents(state, action) {
            state.events = action.payload;
            // state.isLoadingEvents
        },
        schedulesAddEvent(state, action) {
            console.log(action.payload);
            state.events = [...state.events, action.payload.event];
        },
        schedulesEditEvent(state, action) {
            state.events = state.events.map((event) => (event.eventId === action.payload.eventId ? action.payload : event));
        },
        schedulesDeleteEvent(state, action) {
            state.events = state.events.filter((event) => event.eventId !== action.payload);
            state.selectedSchedule = [];
        },
        schedulesLoadingSchedules(state) {
            state.isLoadingSchedules = true;
        },
        schedulesLoadedSchedules(state) {
            state.isLoadingSchedules = false;
        },
        schedulesGetSchedules(state, action) {
            state.selectedSchedule = action.payload;
            state.patients = [];
            state.scheduledPatients = [];
        },
        schedulesCreateEventSchedule(state, action) {
            state.selectedSchedule = [...state.selectedSchedule, action.payload];
        },
        schedulesEditEvent(state, action) {
            state.selectedSchedule = state.selectedSchedule.map((schedule) => (schedule.pk === action.payload.pk ? action.payload : schedule.pk));
        },
        schedulesDeleteEventSchedule(state, action) {
            state.selectedSchedule = state.selectedSchedule.filter((schedule) => schedule.pk !== action.payload.pk);
            state.isLoadingSchedules = false;
        },
        schedulesGetAvailablePhysicians(state, action) {
            state.availablePhysicians = action.payload;
        },
        schedulesCreatePatientAppointment(state, action) {
            state.scheduledPatients = [...state.scheduledPatients, action.payload];
        },
        schedulesEditPatientAppointment(state, action) {
            state.scheduledPatients = state.scheduledPatients.map((scheduledPatient) =>
                scheduledPatient.pk === action.payload.pk ? action.payload : scheduledPatient
            );
        },
        schedulesDeletePatientAppointment(state, action) {
            state.scheduledPatients = state.scheduledPatients.filter((schedule) => schedule.pk !== action.payload);
            state.isLoadingSchedules = false;
        },
        schedulesNewDateSelected(state, action) {
            state.newDateSelected = action.payload;
            state.selectedSchedulePhysician = null;
        },
        schedulesScheduleSelected(state, action) {
            state.selectedSchedulePhysician = action.payload;
        },

        //PATIENTS
        schedulesGetScheduledPatients(state, action) {
            state.scheduledPatients = action.payload;
            state.isLoadingPatients = false;
        },
        schedulesGetAvailablePatients(state, action) {
            state.availablePatients = action.payload;
            state.isLoadingPatients = false;
        },
        schedulesGetPatientAppointmentDetails(state, action) {
            state.selectedAppointment = action.payload;
            state.isLoadingOverlay = false;
        },
    },
});

export const {
    schedulesGetEvents,
    schedulesGetAvailablePhysicians,
    schedulesCreateEventSchedule,
    schedulesEditEvent,
    schedulesDeleteEvent,
    schedulesNewDateSelected,
    schedulesGetSchedules,
    schedulesGetScheduledPatients,
    schedulesScheduleSelected,
    schedulesGetPatientAppointmentDetails,
    schedulesGetAvailablePatients,
    schedulesCreatePatientAppointment,
    schedulesEditPatientAppointment,
    schedulesDeletePatientAppointment,
    showOverlay,
    hideOverlay,
} = schedulesSlice.actions;

export default schedulesSlice.reducer;

//GET EVENTS
export const getEvents = () => async (dispatch, getState) => {
    try {
        const res = await axios.get(EVENT_API, tokenConfig(getState));
        dispatch(schedulesGetEvents(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//GET CLINIC SCHEDULE BY SELECTED DATE
export const getScheduleDetails = (dateToSearch, dateSelectionStatus) => async (dispatch, getState) => {
    if (dateSelectionStatus) {
        dispatch(schedulesNewDateSelected(dateSelectionStatus));
    }
    try {
        const res = await axios.get(GET_SCHEDULE_API, { params: { date: dateToSearch } }, tokenConfig(getState));
        dispatch(schedulesGetSchedules(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//GET PATIENTS BY SCHEDULE
export const getScheduledPatients = (scheduleId, physicianId) => async (dispatch, getState) => {
    dispatch(schedulesScheduleSelected(physicianId));
    try {
        const res = await axios.get(
            SCHEDULED_PATIENTS_API + "all/",
            { params: { schedule: scheduleId, physician: physicianId } },
            tokenConfig(getState)
        );
        dispatch(schedulesGetScheduledPatients(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//GET AVAILABLE PHYSICIANS
export const getAvailablePhysicians = (date) => async (dispatch, getState) => {
    try {
        const res = await axios.get(SCHEDULE_API + "search_available_physicians/", { params: { date: date } }, tokenConfig(getState));
        dispatch(schedulesGetAvailablePhysicians(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//CREATE EVENT AND SCHEDULE
export const createEventSchedule = (eventSchedule) => async (dispatch, getState) => {
    try {
        const res = await axios.post(SCHEDULE_API, camelCaseKeysToSnake(eventSchedule), tokenConfig(getState));
        dispatch(createMessage({ addSchedule: "Schedule Created" }));
        dispatch(schedulesCreateEventSchedule(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        console.log(err);
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//EDIT EVENT AND SCHEDULE
export const editEventSchedule = (eventScheduleId, eventSchedule) => async (dispatch, getState) => {
    try {
        const res = await axios.put(SCHEDULE_API + `${eventScheduleId}/`, camelCaseKeysToSnake(eventSchedule), tokenConfig(getState));
        dispatch(createMessage({ editSchedule: "Schedule Edited" }));
        dispatch(schedulesEditEvent(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//DELETE EVENT AND SCHEDULE
export const deleteEvent = (eventScheduleId) => async (dispatch, getState) => {
    try {
        const res = await axios.delete(EVENT_API + `${eventScheduleId}/`, tokenConfig(getState));
        dispatch(createMessage({ deleteSchedule: "Schedule Deleted" }));
        dispatch(schedulesDeleteEvent(eventScheduleId));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//GET AVAILABLE PATIENTS FOR APPOINTMENT
export const getAvailablePatients = (eventScheduleId, selectedPatient) => async (dispatch, getState) => {
    try {
        const res = await axios.get(
            SCHEDULED_PATIENTS_API + "available/",
            { params: { schedule: eventScheduleId, include: selectedPatient } },
            tokenConfig(getState)
        );
        dispatch(schedulesGetAvailablePatients(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//GET PATIENT APPOINTMENT DETAILS
export const getAppointmentDetails = (eventScheduleId) => async (dispatch, getState) => {
    try {
        const res = await axios.get(SCHEDULED_PATIENTS_API + eventScheduleId + "/", tokenConfig(getState));
        dispatch(schedulesGetPatientAppointmentDetails(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//CREATE PATIENT APPOINTMENT
export const createPatientAppointment = (appointment) => async (dispatch, getState) => {
    try {
        const res = await axios.post(SCHEDULED_PATIENTS_API, camelCaseKeysToSnake(appointment), tokenConfig(getState));
        dispatch(createMessage({ addAppointment: "Appointment Created" }));
        dispatch(schedulesCreatePatientAppointment(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//EDIT PATIENT APPOINTMENT
export const editPatientAppointment = (appointmentId, appointment) => async (dispatch, getState) => {
    try {
        const res = await axios.put(SCHEDULED_PATIENTS_API + `${appointmentId}/`, camelCaseKeysToSnake(appointment), tokenConfig(getState));
        dispatch(createMessage({ addAppointment: "Appointment Edited" }));
        dispatch(schedulesEditPatientAppointment(snakeCaseKeysToCamel(res.data)));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};

//DELETE PATIENT APPOINTMENT
export const deletePatientAppointment = (appointmentId) => async (dispatch, getState) => {
    try {
        const res = await axios.delete(SCHEDULED_PATIENTS_API + `${appointmentId}/`, tokenConfig(getState));
        dispatch(createMessage({ addAppointment: "Appointment Deleted" }));
        dispatch(schedulesDeletePatientAppointment(appointmentId));
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
    }
};
