import React, { useState, useEffect, useRef, Fragment } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Calendar from "react-calendar";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import _ from "lodash";

import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

import { deleteEvent, getScheduleDetails, getScheduledPatients } from "../../reducers/schedulesSlice";

import { showModal, hideModal } from "../../reducers/modalSlice";
import CreateScheduleForm from "./CreateScheduleForm";
import EditScheduleForm from "./EditScheduleForm";
import CreatePatientAppointment from "./CreatePatientAppointment";
import EditPatientAppointment from "./EditPatientAppointment";
import Pulse from "../../static/images/Pulse.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export const shortenTime = (time, timeFormat) => {
    let shortened = "";

    if (timeFormat === "12H") {
        shortened = format(utcToLocal(time), "hh:mm a");
    } else {
        shortened = format(utcToLocal(time), "HH:mm");
    }

    return shortened;
};

export const formatDate = (date) => {
    const currentDate = format(utcToLocal(date), "yyyy-MM-dd'T'00:00:00.000xxx");
    return currentDate;
};

export const utcToLocal = (dateTime) => {
    let localized = utcToZonedTime(dateTime, Intl.DateTimeFormat().resolvedOptions().timeZone);
    return localized;
};

export const zonedToUtc = (dateTime) => {
    let utcized = zonedTimeToUtc(dateTime, Intl.DateTimeFormat().resolvedOptions().timeZone);
    return utcized;
};

export const getValueFromArrayOrObject = (value) => {
    if (Array.isArray(value)) {
        value = _.first(value).value;
        return value;
    } else if (typeof value === "object") {
        value = value.value;
        return value;
    }
};

export const initializeCurrentDate = () => {
    //To achieve this format: Sat Sep 26 2020 00:00:00 GMT+0800 (Singapore Standard Time)
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
};

function CalendarSchedule(props) {
    const [currentDate, onChange] = useState(() => initializeCurrentDate());
    const dispatch = useDispatch();
    const prevProps = useRef(props.selectedAppointment);

    //Get schedule of current day on page load
    useEffect(() => {
        dispatch(getScheduleDetails(format(utcToLocal(currentDate), "yyyy-MM-dd'T'00:00:00.000xxx")));
    }, []);

    useEffect(() => {
        if (state.schedules.selectedSchedule.length > 0) {
            setNewDateSelected(true);
            setDisableDeleteButton(false);
        } else {
            setDisableDeleteButton(true);
        }
        setDisableCreateButton(false);
    }, [props.selectedSchedule]);

    useEffect(() => {
        console.log(currentDate);
        if (new Date() > currentDate) {
            console.log("Past Date");
        } else {
            console.log("Future Date");
        }
    });

    const [modal, setModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [newDateSelected, setNewDateSelected] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [disableScheduleActionButton, setDisableScheduleActionButton] = useState(true);
    const [disableCreateButton, setDisableCreateButton] = useState(true);
    const [disableDeleteButton, setDisableDeleteButton] = useState(true);
    const [toggleSelected, settoggleSelected] = useState();

    const state = useSelector((state) => state);

    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
    const toggle = () => setModal(!modal);

    const datesToAddClassTo = [];

    for (var i in state.schedules.events) {
        datesToAddClassTo.push(state.schedules.events[i]["startTime"]);
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
        setDisableScheduleActionButton(true);
        settoggleSelected();
        setSelectedDate(value);
        setDisableCreateButton(false);
        dispatch(getScheduleDetails(value));
    }

    function getPatients(scheduleId, physicianId) {
        setDisableScheduleActionButton(false);
        dispatch(getScheduledPatients(scheduleId, physicianId));
    }

    const confirmDelete = () => {
        dispatch(deleteEvent(state.schedules.selectedSchedule[0].event.pk));
        toggle();
    };

    //Handles showing of add/edit appointment modal
    const showScheduleModal = async (type, modalProps) => {
        let date = modalProps.toDateString();
        if (type === "deleteSchedule") {
            toggle();
            dispatch(showModal(type, date));
        } else if (type === "addSchedule") {
            dispatch(showModal(type, date));
        }
        // else if (type === "editSchedule") {
        //     if (state.schedules.scheduledPatients.length > 0) {
        //         alert("please remove all existing appointments before you can edit this schedule.");
        //     } else {
        //         await dispatch(isEditable(state.schedules.selectedSchedule[0].pk));
        //         if (state.schedules.isEditable === false) {
        //             alert("please remove all existing appointments before you can edit this schedule.");
        //         } else {
        //             dispatch(showModal(type, date));
        //         }
        //     }
        // }
        else {
            dispatch(showModal(type, date));
        }
    };

    let componentHeader;
    let myComponent;

    componentHeader = (
        <div className="row mb-1">
            <div className="col-8">
                <p className="mb-0 font-weight-bold" style={{ fontSize: "1.125rem" }}>
                    {format(currentDate, "PPP")}
                </p>
            </div>
            <div className="col-4">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle outline color="secondary" size="sm" className="float-right border-0">
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </DropdownToggle>
                    <DropdownMenu right>
                        {(state.schedules.selectedSchedule.length === 0 && (
                            <DropdownItem onClick={() => showScheduleModal("addSchedule", currentDate)} disabled={disableCreateButton}>
                                Create Schedule
                            </DropdownItem>
                        )) || (
                            <DropdownItem onClick={() => showScheduleModal("editSchedule", currentDate)} disabled={disableCreateButton}>
                                Edit Schedule
                            </DropdownItem>
                        )}
                        <DropdownItem onClick={() => showScheduleModal("deleteSchedule", currentDate)} disabled={disableDeleteButton}>
                            Delete Schedule
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                {/* <button className="menu-button float-right"></button> */}
            </div>
        </div>
    );
    if (state.schedules.isLoadingSchedules === true) {
        myComponent = (
            <div className="d-flex flex-flow-column justify-content-center" style={{ minHeight: "13em" }}>
                <div className="d-flex">
                    <img className="" src={Pulse}></img>
                </div>
            </div>
        );
    } else if (state.schedules.selectedSchedule.length === 0 && state.schedules.isLoadingSchedules === false) {
        myComponent = (
            <div className="row" style={{ minHeight: "13em" }}>
                <div className="col-12 my-auto">
                    <h3 className="text-center">No schedules made</h3>
                </div>
            </div>
        );
    } else {
        myComponent = (
            <div className="">
                <div className="overflow-auto pr-2 custom-scrollbar-css" style={{ maxHeight: "13em" }}>
                    {state.schedules.selectedSchedule.map((schedule, index) =>
                        schedule.physician.map((physician, index2) => (
                            <div
                                key={index2}
                                // className="card-outer rounded mb-2"
                                className={`card-outer rounded mb-2 ${toggleSelected === index2 ? "card-selected" : ""}`}
                                onClick={() => settoggleSelected(index2)}
                            >
                                <div
                                    className="card border-left-info bg-light text-black p-3"
                                    key={index2}
                                    onClick={() => getPatients(schedule.pk, physician.id)}
                                >
                                    <div className="card-title">
                                        <p className="m-0">
                                            {physician.firstName} {physician.lastName}
                                        </p>
                                    </div>
                                    <div className="card-text text-black-50 small user-select-none">
                                        <p className="m-0">
                                            {shortenTime(schedule.event.startTime, "12H")} {" - "} {shortenTime(schedule.event.endTime, "12H")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="col-lg-4 col-md-12 mb-4-xl">
            <div className="calendar-box p-2 mb-2 border border-secondary rounded" style={{}}>
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
            <div className="schedule-box p-2 mb-2 border border-secondary rounded" style={{ height: "16.5em" }}>
                {componentHeader}
                {myComponent}
            </div>
            <div className="text-center button-group mb-2 clearfix border border-secondary rounded p-2" style={{ background: "" }}>
                {(state.schedules.selectedSchedule.length === 0 && (
                    <button
                        className="btn btn-primary btn-md btn-block"
                        data-toggle="modal"
                        data-target="#addScheduleModal"
                        onClick={() => showScheduleModal("addSchedule", currentDate)}
                        disabled={disableCreateButton}
                    >
                        Create Clinic Schedule
                    </button>
                )) || (
                    <button
                        className="btn btn-primary btn-md btn-block"
                        data-toggle="modal"
                        data-target="#addScheduleModal"
                        onClick={() => showScheduleModal("editSchedule", currentDate)}
                        disabled={disableCreateButton}
                    >
                        Edit Clinic Schedule
                    </button>
                )}

                <button
                    className="btn btn-primary btn-md btn-block"
                    data-toggle="modal"
                    data-target="#addAppointmentModal"
                    onClick={() => showScheduleModal("addAppointment", currentDate)}
                    disabled={disableScheduleActionButton}
                >
                    Schedule a Patient
                </button>
            </div>
            {(state.schedules.isLoadingOverlay === true && <div className="loading">Loading&#8230;</div>) ||
                (() => {
                    switch (state.modal.modalMode) {
                        case "addSchedule":
                            return (
                                <Fragment>
                                    <CreateScheduleForm toggleModal={true} />
                                </Fragment>
                            );
                        case "editSchedule":
                            return (
                                <Fragment>
                                    <EditScheduleForm toggleModal={true} />
                                </Fragment>
                            );
                        case "addAppointment":
                            return (
                                <Fragment>
                                    <CreatePatientAppointment toggleModal={true} />
                                </Fragment>
                            );
                        case "editAppointment":
                            return (
                                <Fragment>
                                    <EditPatientAppointment toggleModal={true} />
                                </Fragment>
                            );
                        default:
                            return null;
                    }
                })()}
            <Modal isOpen={modal} toggle={toggle} backdrop="static" keyboard={false}>
                <ModalHeader>Delete Schedule</ModalHeader>
                <ModalBody>
                    Deleting this schedule will also <b>delete all patient appointments</b> for this date. Do you want to continue?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => confirmDelete()}>
                        Yes
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => ({
    events: state.schedules.events,
    selectedSchedule: state.schedules.selectedSchedule,
    patients: state.schedules.patients,
    isLoadingEvents: state.schedules.isLoadingEvents,
    isLoadingSchedules: state.schedules.isLoadingSchedules,
    isLoadingPatients: state.schedules.isLoadingPatients,
    isLoadingOverlay: state.schedules.isLoadingOverlay,
    modal: state.modal,
    availablePatients: state.schedules.availablePatients,
    selectedAppointment: state.schedules.selectedAppointment,
    selectedSchedulePhysician: state.schedules.selectedSchedulePhysician,
});

// export default connect(mapStateToProps, { getScheduleDetails, getScheduledPatients })(CalendarSchedule);
export default CalendarSchedule;
