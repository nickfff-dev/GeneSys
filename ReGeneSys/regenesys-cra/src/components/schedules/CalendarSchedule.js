import React, { useState, useEffect, Fragment } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import Calendar from "react-calendar";
import { differenceInCalendarDays, parseISO, format } from "date-fns";

import { getSchedules, getScheduledPatients } from "../../actions/schedules";
import { showModal, hideModal } from "../../actions/modal";

import CreateEventForm from "./CreateEventForm";

export function shortenTime(time) {
    console.log(time);
    let splitTime = time.split(":");
    let shortened = splitTime[0] + ":" + splitTime[1];

    return shortened;
}

function CalendarSchedule(props) {
    const [currentDate, onChange] = useState(new Date());
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSchedules(format(currentDate, "yyyy-MM-dd")));
    }, []);

    const [modal, setModal] = useState(false);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);
    const state = useSelector((state) => state);

    const toggle = () => {
        setModal(!modal);
    };

    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };
    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    };

    const datesToAddClassTo = [];

    for (var i in props.events) {
        datesToAddClassTo.push(props.events[i]["date"]);
    }

    function isSameDay(a, b) {
        return differenceInCalendarDays(a, b) === 0;
    }

    function tileClassName({ date, view }) {
        // Add class to tiles in month view only
        if (view === "month") {
            return datesToAddClassTo.find((dDate) => isSameDay(parseISO(dDate), date)) ? "event-class" : "";
        }
    }

    function onClickDay(value) {
        dispatch(getSchedules(format(value, "yyyy-MM-dd")));
    }

    function getPatients(scheduleId, physicianId) {
        dispatch(getScheduledPatients(scheduleId, physicianId));
    }

    function showScheduleModal(type, modalProps) {
        if (type === "delete") {
            toggle();
            dispatch(showModal(type, modalProps));
        }
        else if(type === "addSchedule"){
            if(props.schedules.length === 0){
                type = "createEvent"
            }
            dispatch(showModal(type, modalProps));
        }
        else {
            dispatch(showModal(type, modalProps));
        }
    }

    let componentHeader;
    let myComponent;

    if (props.isLoadingSchedules) {
        myComponent = <h1>Loading</h1>;
    } else {
        componentHeader = (
            <h6 className="h-4">
                Schedules for <i>{format(currentDate, "yyyy-MM-dd")}</i>
            </h6>
        );
        if (props.schedules.length === 0) {
            myComponent = (
                <div className="row h-75">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">No schedules made</h3>
                    </div>
                </div>
            );
        } else {
            myComponent = (
                <div className="row">
                    <div className="col-12">
                        {props.schedules.map((schedule, index) => (
                            schedule.physician.map((physician, index2) => (
                            <div
                            key={index2}
                            className="card border-left-info bg-light text-black shadow m-1"
                            onClick={() => getPatients(schedule.pk, physician.id)}
                            >
                                <div className="card-body user-select-none">
                                    {physician.firstName} {" "} {physician.lastName}
                                    <div className="text-black-50 small user-select-none">
                                        {shortenTime(schedule.event.timeStart)} {" - "} {shortenTime(schedule.event.timeEnd)}
                                    </div>
                                </div>
                            </div>
                                ))   
                        ))}
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="col-lg-4 col-md-12 mb-4-xl">
            <div className="calendar-box p-2 mb-2 rounded" style={{ background: "cyan" }}>
                <Calendar
                    calendarType="US"
                    className={["rc-override", "mr-auto", "ml-auto"]}
                    minDetail="decade"
                    onChange={onChange}
                    onClickDay={onClickDay}
                    tileClassName={tileClassName}
                    value={currentDate}
                />
            </div>
            <div className="schedule-box p-2 mb-2 rounded" style={{ background: "cyan" }}>
                {componentHeader}
                {myComponent}
            </div>
            <div className="text-center button-group mb-2 clearfix rounded p-2" style={{ background: "cyan" }}>
                <button
                    className="btn btn-primary btn-md btn-block"
                    data-toggle="modal"
                    data-target="#addScheduleModal"
                    onClick={() => showScheduleModal("addSchedule", currentDate)}
                >
                    Create Clinic Schedule
                </button>
                <button
                    className="btn btn-primary btn-md btn-block"
                    data-toggle="modal"
                    data-target="#addAppointmentModal"
                    onClick={() => showScheduleModal("addAppointment", currentDate)}
                >
                    Schedule Patient Appointment
                </button>
            </div>
            {(() => {
                switch (state.modal.modalMode) {
                    case "createEvent":
                        return (
                            <Fragment>
                                <CreateEventForm toggleModal={true} />
                            </Fragment>
                        );
                    case "edit":
                        return <Fragment>{/* <EditForm toggleModal={true} /> */}</Fragment>;
                    case "view":
                        return <Fragment>{/* <ViewModal toggleModal={true} /> */}</Fragment>;
                    default:
                        return null;
                }
            })()}
        </div>
    );
}

const mapStateToProps = (state) => ({
    events: state.schedules.events,
    schedules: state.schedules.schedules,
    patients: state.schedules.patients,
    isLoadingEvents: state.schedules.isLoadingEvents,
    isLoadingSchedules: state.schedules.isLoadingSchedules,
    isLoadingPatients: state.schedules.isLoadingPatients,
    modal: state.modal,
});

export default connect(mapStateToProps, { getSchedules, getScheduledPatients })(CalendarSchedule);
