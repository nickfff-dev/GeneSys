import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import {
    GET_EVENTS,
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
} from "./types";
import { EVENT_API, GET_SCHEDULE_API, SCHEDULED_PATIENTS_API, SCHEDULE_API } from "../constants";
import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "../actions/utils";

export const showOverlay = (msg) => (dispatch, getState) => {
    dispatch({
        type: LOAD_OVERLAY,
    });
};

export const hideOverlay = (msg) => (dispatch, getState) => {
    dispatch({
        type: UNLOAD_OVERLAY,
    });
};

//GET EVENTS
export const getEvents = () => (dispatch, getState) => {
    axios
        .get(EVENT_API, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_EVENTS,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET CLINIC SCHEDULE BY SELECTED DATE
export const getScheduleDetails = (dateToSearch, dateSelectionStatus) => (dispatch, getState) => {
    console.log(dateToSearch);
    console.log(dateSelectionStatus);
    if (dateSelectionStatus) {
        dispatch({
            type: NEW_DATE_SELECTED,
            payload: dateSelectionStatus,
        });
    }
    axios
        .get(GET_SCHEDULE_API, { params: { date: dateToSearch } }, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_SCHEDULES,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET PATIENTS BY SCHEDULE
export const getScheduledPatients = (scheduleId, physicianId) => (dispatch, getState) => {
    dispatch({
        type: SCHEDULE_SELECTED,
        payload: physicianId,
    });
    axios
        .get(SCHEDULED_PATIENTS_API + "all/", { params: { schedule: scheduleId, physician: physicianId } }, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_SCHEDULED_PATIENTS,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET AVAILABLE PHYSICIANS
export const getAvailablePhysicians = (date) => (dispatch, getState) => {
    axios
        .get(SCHEDULE_API + "search_available_physicians/", { params: { date: date } }, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_AVAILABLE_PHYSICIANS,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//CREATE EVENT AND SCHEDULE
export const createEventSchedule = (eventSchedule) => (dispatch, getState) => {
    axios
        .post(SCHEDULE_API, camelCaseKeysToSnake(eventSchedule), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addSchedule: "Schedule Created" }));
            dispatch({
                type: CREATE_EVENTSCHEDULE,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//EDIT EVENT AND SCHEDULE
export const editEventSchedule = (eventScheduleId, eventSchedule) => (dispatch, getState) => {
    axios
        .put(SCHEDULE_API + `${eventScheduleId}/`, camelCaseKeysToSnake(eventSchedule), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ editSchedule: "Schedule Edited" }));
            dispatch({
                type: EDIT_EVENTSCHEDULE,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE EVENT AND SCHEDULE
export const deleteEvent = (eventScheduleId) => (dispatch, getState) => {
    axios
        .delete(EVENT_API + `${eventScheduleId}/`, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ deleteSchedule: "Schedule Deleted" }));
            dispatch({
                type: DELETE_EVENTSCHEDULE,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return eventScheduleId;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET AVAILABLE PATIENTS FOR APPOINTMENT
export const getAvailablePatients = (eventScheduleId, selectedPatient) => (dispatch, getState) => {
    axios
        .get(SCHEDULED_PATIENTS_API + "available/", { params: { schedule: eventScheduleId, include: selectedPatient } }, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_AVAILABLE_PATIENTS,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//GET PATIENT APPOINTMENT DETAILS
export const getAppointmentDetails = (eventScheduleId) => (dispatch, getState) => {
    // dispatch({ type: LOAD_OVERLAY });
    axios
        .get(SCHEDULED_PATIENTS_API + eventScheduleId + "/", tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_PATIENT_APPOINTMENT_DETAILS,
                payload: snakeCaseKeysToCamel(res.data),
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//CREATE PATIENT APPOINTMENT
export const createPatientAppointment = (appointment) => (dispatch, getState) => {
    axios
        .post(SCHEDULED_PATIENTS_API, camelCaseKeysToSnake(appointment), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addAppointment: "Appointment Created" }));
            dispatch({
                type: CREATE_PATIENT_APPOINTMENT,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//EDIT PATIENT APPOINTMENT
export const editPatientAppointment = (appointmentId, appointment) => (dispatch, getState) => {
    axios
        .put(SCHEDULED_PATIENTS_API + `${appointmentId}/`, camelCaseKeysToSnake(appointment), tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ addAppointment: "Appointment Edited" }));
            dispatch({
                type: EDIT_PATIENT_APPOINTMENT,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

//DELETE PATIENT APPOINTMENT
export const deletePatientAppointment = (appointmentId) => (dispatch, getState) => {
    axios
        .delete(SCHEDULED_PATIENTS_API + `${appointmentId}/`, tokenConfig(getState))
        .then((res) => {
            dispatch(createMessage({ deleteSchedule: "Appointment Deleted" }));
            dispatch({
                type: DELETE_PATIENT_APPOINTMENT,
                payload: appointmentId,
            });
            return appointmentId;
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};
