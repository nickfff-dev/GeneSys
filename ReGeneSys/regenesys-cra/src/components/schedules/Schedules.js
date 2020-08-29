import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";

import CalendarSchedule from "./CalendarSchedule";
import TableSchedule from "./TableSchedule";

import { getEvents } from "../../actions/schedules";

import "react-calendar/dist/Calendar.css";
import "../../App.css";

function Schedules(props) {
    const { getEvents } = props;

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <Fragment>
            <div className="mb-3">
                <h2>Patient Scheduling</h2>
            </div>
            <div className="row">
                <CalendarSchedule />
                <div className="col-lg-8 col-md -12">
                    <TableSchedule />
                </div>
            </div>
        </Fragment>
    );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
    getEvents,
})(Schedules);
