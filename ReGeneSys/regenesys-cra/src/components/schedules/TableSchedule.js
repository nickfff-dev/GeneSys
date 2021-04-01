import React, { useMemo, useEffect, useState, useRef, usePrevious } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { format } from "date-fns";
import { split } from "lodash";
import { shortenTime, formatDate, zonedToUtc } from "./CalendarSchedule";
import { showModal } from "../../reducers/modalSlice";
import { deletePatientAppointment, toggleLoadingOverlay, getAppointmentDetails, getAvailablePatients } from "../../reducers/schedulesSlice";
import Pulse from "../../static/images/Pulse.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faNotesMedical, faBackward, faCaretLeft, faCaretRight, faForward } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";

function usePreviousSelection(schedule) {
    const ref = useRef();

    useEffect(() => {
        ref.current = schedule;
    });

    return ref.current;
}

function TableSchedule(props) {
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState();
    const [modalProps, setModalProps] = useState();
    const [tableMessage, setTableMessage] = useState();
    const prevSelectedSchedule = usePreviousSelection(props.selectedSchedule);
    const [currentDateTime, onChange] = useState(new Date().toISOString());

    const state = useSelector((state) => state.schedules);
    const dispatch = useDispatch();

    useEffect(() => {
        if (state.selectedSchedule[0]) {
            if (state.selectedSchedulePhysician && state.scheduledPatients.length === 0) {
                setTableMessage("No Patients Scheduled");
            } else {
                setTableMessage("Please Select a Doctor");
            }
        } else {
            setTableMessage("Please Create a Schedule");
        }
    });

    const toggle = () => {
        setModal(!modal);
    };

    //useMemo is required by react-table.
    const data = useMemo(() => getPatientData(state.scheduledPatients), [state.scheduledPatients]);
    const columns = useMemo(
        () => [
            {
                Header: "Time",
                accessor: "col1", // accessor is the "key" in the data,
            },
            {
                Header: "Patient",
                accessor: "col2",
            },
            {
                Header: "Clinic Type",
                accessor: "col3",
            },
            {
                Header: "Status",
                accessor: "col4",
            },
            {
                Header: "Actions",
                accessor: "col5",
            },
        ],
        []
    );

    function getPatientData(patients) {
        var allData = [];
        var timeFormat = "12H";
        patients.forEach((element) => {
            if (currentDateTime > element.startTime && currentDateTime > element.endTime) {
                console.log("past sched");
            } else {
                console.log("future sched");
            }
            let actionCol;
            if (currentDateTime > element.startTime && currentDateTime > element.endTime) {
                actionCol = (
                    <div>
                        <button
                            className="btn btn-sm btn-primary"
                            data-toggle="tooltip"
                            title="Create Report"
                            onClick={() => showAppointment("report", element)}
                        >
                            <FontAwesomeIcon icon={faNotesMedical} />
                        </button>
                    </div>
                );
            } else {
                actionCol = (
                    <div className="d-flex flex-nowrap justify-content-around">
                        <button
                            className="btn btn-sm btn-primary"
                            data-toggle="tooltip"
                            title="Edit Appointment"
                            onClick={() => showAppointment("editAppointment", element)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            data-toggle="tooltip"
                            title="Delete Appointment"
                            onClick={() => showAppointment("deleteAppointment", element)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                );
            }

            var row = {
                col1: shortenTime(element.startTime, timeFormat) + " - " + shortenTime(element.endTime, timeFormat),
                col2: element.patient.firstName,
                col3: element.patient.clinical.patientType,
                col4: element.status,
                col5: actionCol,
            };
            allData.push(row);
        });
        return allData;
    }

    const showAppointment = async (type, appointment) => {
        if (type === "editAppointment") {
            await dispatch(getAppointmentDetails(appointment.pk));
            dispatch(showModal(type, appointment.pk));
        } else if (type === "report") {
        } else {
            setModalType(type);
            setModalProps(appointment.pk);
            toggle();
        }
    };

    const onSubmit = () => {
        dispatch(deletePatientAppointment(modalProps));
        toggle();
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize: 10,
                pageIndex: 0,
                globalFilter: "",
            },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    let tableComponent;
    if (state.isLoadingAppointments || state.isLoadingSchedules) {
        tableComponent = (
            <div className="d-flex flex-flow-column justify-content-center h-100">
                <div className="d-flex">
                    <img className="" src={Pulse}></img>
                </div>
            </div>
        );
    } else {
        if (data.length === 0 && (!state.isLoadingAppointments || !state.isLoadingSchedules)) {
            tableComponent = (
                <div className="row h-100">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">{tableMessage}</h3>
                    </div>
                </div>
            );
        } else {
            tableComponent = (
                <Fragment>
                    <div className="schedule-table-container h-md-100">
                        <table className="table table-striped table-bordered table-responsive-sm" {...getTableProps()}>
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th className="text-center" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.render("Header")}
                                                <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="text-center" {...getTableBodyProps()}>
                                {page.map((row, i) => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => {
                                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination d-block text-center mb-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            <FontAwesomeIcon icon={faBackward} />

                            {/* <span className="font-weight-bolder">{"<<"}</span> */}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary px-2 mx-2" onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <FontAwesomeIcon icon={faCaretLeft} />

                            {/* <span className="font-weight-bolder">{"<"}</span> */}
                        </button>
                        <span>
                            Page{" "}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>{" "}
                        </span>
                        <button className="btn btn-sm btn-outline-secondary px-2 mx-2" onClick={() => nextPage()} disabled={!canNextPage}>
                            <FontAwesomeIcon icon={faCaretRight} />
                            {/* <span className="font-weight-bolder">{">"}</span> */}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            <FontAwesomeIcon icon={faForward} />
                            {/* <span className="font-weight-bolder">{">>"}</span> */}
                        </button>
                    </div>
                </Fragment>
            );
        }
    }

    return (
        <div className="rounded h-100">
            <div className="schedule-container h-100 d-flex flex-column">{tableComponent}</div>
            <Modal isOpen={modal} toggle={toggle} backdrop="static" keyboard={false}>
                <ModalHeader>Delete Appointment</ModalHeader>
                <ModalBody>Are you sure you want to delete appointment?</ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onSubmit}>
                        Yes
                    </Button>
                    <Button color="secondary" onClick={() => toggle()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => ({
    scheduledPatients: state.schedules.scheduledPatients,
    isLoadingPatients: state.schedules.isLoadingPatients,
    isLoadingAppointments: state.schedules.isLoadingAppointments,
    isLoadingSchedules: state.schedules.isLoadingSchedules,
    selectedSchedule: state.schedules.selectedSchedule,
    availablePatients: state.schedules.availablePatients,
    selectedAppointment: state.schedules.selectedAppointment,
    modal: state.modal,
    newDateSelected: state.schedules.newDateSelected,
    selectedSchedulePhysician: state.schedules.selectedSchedulePhysician,
    isLoadingOverlay: state.schedules.isLoadingOverlay,
});

export default connect(mapStateToProps, {})(TableSchedule);
