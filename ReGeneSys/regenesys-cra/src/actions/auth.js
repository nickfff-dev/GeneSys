import axios from "axios";
import { returnErrors } from "./messages";

import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

import { AUTH_URL } from "../constants";

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    axios
        .get(AUTH_URL + "user", tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR,
            });
        });
};

//LOGIN USER
export const login = (username, password) => (dispatch) => {
    //Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    //Request Body
    const body = JSON.stringify({ username, password });

    axios
        .post(AUTH_URL + "login", body, config)
        .then((res) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL,
            });
        });
};

//LOGOUT USER
export const logout = () => (dispatch, getState) => {
    axios
        .post(AUTH_URL + "logout/", null, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

//Setup Token Config

export const tokenConfig = (getState) => {
    // GET TOKEN FROM STATE
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    //IF TOKEN, ADD TO HEADER CONFIG
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};

//REGISTER USER
export const register = ({ username, password, email }) => (dispatch) => {
    //Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    //Request Body
    const body = JSON.stringify({ username, email, password });

    axios
        .post(AUTH_URL + "register", body, config)
        .then((res) => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL,
            });
        });
};
