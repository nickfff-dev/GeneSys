import React, { Fragment } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUsers, faCalendarAlt, faMedkit } from "@fortawesome/free-solid-svg-icons";
import "../../static/sb-admin2/css/sb-admin-2.css";
import logo from "../../static/images/logo.png";

export function Sidebar() {
    let { path, url } = useRouteMatch();
    return (
        <Fragment>
            {/* Sidebar */}
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* Sidebar - Brand */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div className="sidebar-brand-icon">
                        <img className="logo-small" src={logo}></img>
                    </div>
                    <div className="sidebar-brand-text mx-3">GeneSys</div>
                </a>
                {/* Divider */}
                <hr className="sidebar-divider my-0" />
                {/* Nav Item - Dashboard */}
                <li className="nav-item active">
                    <Link className="nav-link" to={`/dashboard`}>
                        <FontAwesomeIcon icon={faTachometerAlt} className="mr-1" />
                        <span>Dashboard</span>
                    </Link>
                    {/* <a className="" href="/dasboard">
                        
                        
                    </a> */}
                </li>
                {/* Divider */}
                <hr className="sidebar-divider" />
                {/* Heading */}
                <div className="sidebar-heading">Addons</div>
                {/* Nav Item - Charts */}
                <li className="nav-item">
                    <Link className="nav-link" to={`/patients`}>
                        <FontAwesomeIcon icon={faUsers} className="mr-1" />
                        <span>Patient Management</span>
                    </Link>
                    {/* <a className="nav-link" href="/patients"></a> */}
                </li>
                {/* Nav Item - Tables */}
                <li className="nav-item">
                    <Link className="nav-link" to={`/schedule`}>
                    {/* <a className="nav-link" href="/schedule"> */}
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        <span>Patient Scheduling</span>
                    {/* </a> */}
                    </Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/invetory">
                        <FontAwesomeIcon icon={faMedkit} className="mr-1" />
                        <span>Inventory Management</span>
                    </a>
                </li>
            </ul>
            {/* End of Sidebar */}{" "}
        </Fragment>
    );
}
export default Sidebar;
