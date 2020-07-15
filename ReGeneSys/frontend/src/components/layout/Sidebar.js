import React, { Component, Fragment, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faAngleUp, faUsers, faCalendarAlt, faMedkit } from "@fortawesome/free-solid-svg-icons";
import "../../../static/frontend/sb-admin2/css/sb-admin-2.css";

export function Sidebar() {
    return (
        <Fragment>
            {/* Sidebar */}
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* Sidebar - Brand */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div className="sidebar-brand-icon">
                        <img className="logo-small" src="../../../static/frontend/images/IHT Thumbnail Logo.png"></img>
                    </div>
                    <div className="sidebar-brand-text mx-3">GeneSys</div>
                </a>
                {/* Divider */}
                <hr className="sidebar-divider my-0" />
                {/* Nav Item - Dashboard */}
                <li className="nav-item active">
                    <a className="nav-link" href="/dashboard">
                        <FontAwesomeIcon icon={faTachometerAlt} className="mr-1" />
                        <span>Dashboard</span>
                    </a>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider" />
                {/* Heading */}
                <div className="sidebar-heading">Addons</div>
                {/* Nav Item - Charts */}
                <li className="nav-item">
                    <a className="nav-link" href="/patients">
                        <FontAwesomeIcon icon={faUsers} className="mr-1" />
                        <span>Patient Management</span>
                    </a>
                </li>
                {/* Nav Item - Tables */}
                <li className="nav-item">
                    <a className="nav-link" href="/schedule">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        <span>Patient Scheduling</span>
                    </a>
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
