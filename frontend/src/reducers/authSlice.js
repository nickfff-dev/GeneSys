import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { returnErrors } from "./errorsSlice";

import { AUTH_URL } from "../constants";

export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: true,
    user: null,
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        default:
            return state;
    }
}

//CHECK TOKEN & LOAD USER
export const loadUser = () => async (dispatch, getState) => {
    try {
        const res = await axios.get(AUTH_URL + "user", tokenConfig(getState));
        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: AUTH_ERROR,
        });
    }
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
