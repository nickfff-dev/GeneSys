import React, { Component } from "react";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { unmountComponentAtNode } from "react-dom";
import Spinner from "../../static/images/Spinner.svg";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (auth.isLoading) {
                return (
                    <div className="d-flex flex-flow-column justify-content-center h-100">
                        <div className="d-flex justify-content-center">
                            <img className="" src={Spinner}></img>
                        </div>
                    </div>
                );
            } else if (!auth.isAuthenticated) {
                return <Redirect to="/login" />;
            } else {
                return <Component {...props} />;
            }
        }}
    />
);

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
