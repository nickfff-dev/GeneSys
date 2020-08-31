import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./auth";

import { GET_EVENTS, GET_SCHEDULES, GET_SCHEDULED_PATIENTS, GET_AVAILABLE_PHYSICIANS } from "./types";
import { EVENT_API, GET_SCHEDULE_API, GET_SCHEDULED_PATIENTS_API , SCHEDULE_API} from "../constants";
import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "../actions/utils";

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
export const getSchedules = (dateToSearch) => (dispatch, getState) => {
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
    axios
        .get(GET_SCHEDULED_PATIENTS_API, { params: { schedule: scheduleId, physician:physicianId } }, tokenConfig(getState))
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
        .get(SCHEDULE_API + "search_available_physicians/", { params: { date: date} }, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: GET_AVAILABLE_PHYSICIANS,
                payload: snakeCaseKeysToCamel(res.data),
            });
            return res
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};
