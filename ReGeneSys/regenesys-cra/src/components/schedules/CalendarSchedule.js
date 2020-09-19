import React, { useState, useEffect, Fragment } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardTitle,
    CardText,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";

import Calendar from "react-calendar";
import { differenceInCalendarDays, parseISO, format } from "date-fns";

import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

import { getScheduleDetails, getScheduledPatients, deleteEvent } from "../../actions/schedules";

import { showModal, hideModal } from "../../actions/modal";

import CreateScheduleForm from "./CreateScheduleForm";
import EditScheduleForm from "./EditScheduleForm";
import CreatePatientAppointment from "./CreatePatientAppointment";

export const shortenTime = (time) => {
    let shortened = format(utcToZonedTime(time, Intl.DateTimeFormat().resolvedOptions().timeZone), "HH:mm a");

    console.log(format(utcToZonedTime(time, Intl.DateTimeFormat().resolvedOptions().timeZone), "yyyy-MM-dd HH:mm"));

    return shortened;
};

function CalendarSchedule(props) {
    const [currentDate, onChange] = useState(new Date());
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getScheduleDetails(format(currentDate, "yyyy-MM-dd")));
    }, []);

    const [modal, setModal] = useState(false);
    // const [nestedModal, setNestedModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const state = useSelector((state) => state);

    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const toggle = () => setModal(!modal);

    // const toggleNested = () => {
    //     setNestedModal(!nestedModal);
    //     setCloseAll(false);
    // };
    // const toggleAll = () => {
    //     setNestedModal(!nestedModal);
    //     setCloseAll(true);
    // };

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
        dispatch(getScheduleDetails(format(value, "yyyy-MM-dd")));
    }

    function getPatients(scheduleId, physicianId) {
        dispatch(getScheduledPatients(scheduleId, physicianId));
    }

    function showScheduleModal(type, modalProps) {
        if (type === "deleteSchedule") {
            toggle();
            dispatch(showModal(type, modalProps));
        } else if (type === "addSchedule") {
            dispatch(showModal(type, modalProps));
        } else {
            dispatch(showModal(type, modalProps));
        }
    }

    const confirmDelete = () => {
        dispatch(deleteEvent(props.selectedSchedule[0].event.pk));
        toggle();
    };

    let componentHeader;
    let myComponent;

    if (props.isLoadingSchedules) {
        myComponent = <h1>Loading</h1>;
    } else {
        componentHeader = (
            <div className="row">
                <div className="col-8">
                    <h6 className="h-4">
                        Schedules for <i>{format(currentDate, "yyyy-MM-dd")}</i>
                    </h6>
                </div>
                <div className="col-4">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle className="float-right">
                            <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                className="bi bi-three-dots-vertical"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                                />
                            </svg>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={() => showScheduleModal("editSchedule", currentDate)}> Edit Schedule</DropdownItem>
                            <DropdownItem onClick={() => showScheduleModal("deleteSchedule", currentDate)}>Delete Schedule</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* <button className="menu-button float-right"></button> */}
                </div>
            </div>
        );
        if (props.selectedSchedule.length === 0) {
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
                        {props.selectedSchedule.map((schedule, index) =>
                            schedule.physician.map((physician, index2) => (
                                <Card
                                    key={index2}
                                    body
                                    outline
                                    className="border-left-info bg-light text-black shadow m-1"
                                    onClick={() => getPatients(schedule.pk, physician.id)}
                                >
                                    <CardTitle>
                                        {physician.firstName} {physician.lastName}
                                    </CardTitle>
                                    <CardText className="text-black-50 small user-select-none">
                                        {shortenTime(schedule.event.startTime)} {" - "} {shortenTime(schedule.event.endTime)}
                                    </CardText>
                                </Card>
                            ))
                        )}
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
                {(props.selectedSchedule.length === 0 && (
                    <button
                        className="btn btn-primary btn-md btn-block"
                        data-toggle="modal"
                        data-target="#addScheduleModal"
                        onClick={() => showScheduleModal("addSchedule", currentDate)}
                    >
                        Create Clinic Schedule
                    </button>
                )) || (
                    <button
                        className="btn btn-primary btn-md btn-block"
                        data-toggle="modal"
                        data-target="#addScheduleModal"
                        onClick={() => showScheduleModal("editSchedule", currentDate)}
                    >
                        Edit Clinic Schedule
                    </button>
                )}

                <button
                    className="btn btn-primary btn-md btn-block"
                    data-toggle="modal"
                    data-target="#addAppointmentModal"
                    onClick={() => showScheduleModal("addAppointment", currentDate)}
                >
                    Schedule a Patient
                </button>
            </div>
            {(() => {
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
                    default:
                        return null;
                }
            })()}

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader>Delete Schedule</ModalHeader>
                <ModalBody>
                    Deleting this schedule will also <b>delete all patient appointements</b> for this date. Do you want to continue?
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
    selectedSchedule: state.schedules.schedules,
    patients: state.schedules.patients,
    isLoadingEvents: state.schedules.isLoadingEvents,
    isLoadingSchedules: state.schedules.isLoadingSchedules,
    isLoadingPatients: state.schedules.isLoadingPatients,
    modal: state.modal,
});

export default connect(mapStateToProps, { getScheduleDetails, getScheduledPatients })(CalendarSchedule);
