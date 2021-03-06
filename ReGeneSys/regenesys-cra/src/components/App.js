import React, { Component, Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect, browserHistory } from "react-router-dom";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Home from "../components/layout/Home";
import HomeContainer from "../components/layout/HomeContainer";
import Patients from "../components/patients/Patients";
import Dashboard from "../components/patients/Dashboard";

import Alerts from "../components/layout/Alerts";
import Login from "../components/accounts/Login";
import Register from "../components/accounts/Register";
import PrivateRoute from "../components/common/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../reducers/authSlice";

import "../static/css/styles.css";
import logo from "../logo.svg";
import "../App.css";

//Alert Options
const alertOptions = {
    timeout: 3000,
    position: "top center",
};

function App() {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);
    const NoMatch = ({ location }) => (
        <h3>
            No match for <code>{location.pathname}</code>
        </h3>
    );
    return (
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <Router>
                    <Fragment>
                        <Alerts />
                        <Switch>
                            <PrivateRoute exact path="/" component={Home} />
                            <PrivateRoute path="/patients" component={Home} />
                            <PrivateRoute path="/dashboard" component={Home} />
                            <PrivateRoute path="/schedule" component={Home} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                            <Route component={NoMatch} />
                            {/*  */}
                            {/* <PrivateRoute path="/patients" component={<h1>Patients</h1>} />
                            
                            <PrivateRoute path="/schedule" component={<h1>Schedule</h1>} /> */}
                            {/* <Route path="/register" component={Register} />
                            <Route path="/login" component={Login} />
                             */}
                        </Switch>
                    </Fragment>
                </Router>
            </AlertProvider>
        </Provider>
    );
}

export default App;
