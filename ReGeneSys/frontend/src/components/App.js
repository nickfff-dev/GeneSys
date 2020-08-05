import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect, browserHistory } from "react-router-dom";
import { createHashHistory } from "history";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Home from "./layout/Home";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Dashboard from "./patients/Dashboard";
import Alerts from "./layout/Alerts";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import PrivateRoute from "./common/PrivateRoute";

import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/auth";

import "../../static/frontend/styles.css";

//Alert Options
const alertOptions = {
    timeout: 3000,
    position: "top center",
};

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    history = createHashHistory({
        basename: "", // The base URL of the app (see below)
        hashType: "slash", // The hash type to use (see below)
        // A function to use to confirm navigation with the user (see below)
        getUserConfirmation: (message, callback) => callback(window.confirm(message)),
    });

    render() {
        return (
            <Provider store={store}>
                <AlertProvider template={AlertTemplate} {...alertOptions}>
                    <Router>
                        <Fragment>
                            <Alerts />
                            <div className="">
                                <Switch>
                                    <PrivateRoute exact path="/" component={Home} />
                                    <Route path="/register" component={Register} />
                                    <Route path="/login" component={Login} />
                                </Switch>
                            </div>
                        </Fragment>
                    </Router>
                </AlertProvider>
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
