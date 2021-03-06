import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../reducers/authSlice";

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            // <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            //     <span className="navbar-text mr-3">
            //         <strong>{user ? `Welcome ${user.username}` : ""}</strong>
            //     </span>
            //     <li className="nav-item">
            //         <a onClick={this.props.logout} className="nav-link btn btn-info btn-sn text-light">
            //             Logout
            //         </a>
            //     </li>
            // </ul>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdownMenuLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <strong>{user ? `Welcome ${user.username}` : ""}</strong>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                        <a className="dropdown-item" href="#">
                            Action
                        </a>
                        <a className="dropdown-item" href="#">
                            Another action
                        </a>
                        <a onClick={this.props.logout} className="dropdown-item">
                            Logout
                        </a>
                    </div>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                    <Link to="/register" className="nav-link">
                        Register
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </li>
            </ul>
        );

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    GeneSys
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarText"
                    aria-controls="navbarText"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>

            // <div class="bg-light border-right" id="sidebar-wrapper">
            //     <div class="sidebar-heading">Start Bootstrap </div>
            //     <div class="list-group list-group-flush">
            //         <a href="#" class="list-group-item list-group-item-action bg-light">
            //             Dashboard
            //         </a>
            //         <a href="#" class="list-group-item list-group-item-action bg-light">
            //             Shortcuts
            //         </a>
            //         <a href="#" class="list-group-item list-group-item-action bg-light">
            //             Overview
            //         </a>
            //         <a href="#" class="list-group-item list-group-item-action bg-light">
            //             Events
            //         </a>
            //         <a href="#" class="list-group-item list-group-item-action bg-light">
            //             Profile
            //         </a>
            //         <a href="#" class="list-group-item list-group-item-action bg-light">
            //             Status
            //         </a>
            //     </div>
            // </div>
            // <nav className="navbar navbar-expand-sm navbar-light bg-light">
            //     <div className="">
            //         <button
            //             className="navbar-toggler"
            //             type="button"
            //             data-toggle="collapse"
            //             data-target="#navbarTogglerDemo01"
            //             aria-controls="navbarTogglerDemo01"
            //             aria-expanded="false"
            //             aria-label="Toggle navigation"
            //         >
            //             <span className="navbar-toggler-icon" />
            //         </button>
            //         <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            //             <a className="navbar-brand" href="#">
            //                 GeneSys
            //             </a>
            //         </div>
            //         {isAuthenticated ? authLinks : guestLinks}
            //     </div>
            // </nav>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
