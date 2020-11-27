import React, { useMemo, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


import { format } from "date-fns";
import { split } from "lodash";
import { shortenTime } from "./CalendarSchedule";
import { showModal } from "../../actions/modal";
import { showOverlay, hideOverlay, getAppointmentDetails, getAvailablePatients, deletePatientAppointment} from "../../actions/schedules";

function TableSchedule(props) {
    // const APIValue = useSelector((state) => state);
    // const state = useSelector((state) => state);

    // const patients = useSelector((state) => state.schedules.patients);
    // const data = useMemo(() => getPatientData(props.patients), [patients]);
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState();
    const [modalProps, setModalProps] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideOverlay())
    }, [props.availablePatients.length !== 0 && props.selectedAppointment !== 0])

    useEffect(() => {
        console.log(modalType)
        dispatch(showModal(modalType, modalProps))
    }, [props.isLoadingOverlay == false])

    const toggle = () => {
        setModal(!modal);
    };

    //useMemo is required by react-table.
    const data = useMemo(() => getPatientData(props.scheduledPatients), [props.scheduledPatients]);
    const columns = useMemo(
        () => [
            {
                Header: "Time",
                accessor: "col1", // accessor is the "key" in the data,
                sortMethod: (a, b) => {
                    var a1 = new Date(a).getTime();
                    var b1 = new Date(b).getTime();
                  if(a1<b1)
                  return 1;
                  else if(a1>b1)
                  return -1;
                  else
                  return 0;
                  }
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
                Header: "",
                accessor: "col5",
            },
        ],
        []
    );

    function getPatientData(patients) {
        var allData = [];
        var timeFormat = "12H";
        patients.forEach((element) => {
            var row = {
                col1: shortenTime(element.startTime, timeFormat) + " - " + shortenTime(element.endTime, timeFormat),
                col2: element.patient.patientId,
                col3: element.patient.clinical.patientType,
                col4: element.status,
                col5: (
                    <div>
                        <button onClick={() => showAppointment("editAppointment", element)}>edit</button>
                        <button onClick={() => showAppointment("deleteAppointment", element)}>delete</button>
                    </div>
                ),
            };
            allData.push(row);
        });
        return allData;
    }

    const showAppointment = (type, appointment) =>{
        if(type === "editAppointment"){
            dispatch(showOverlay())
            dispatch(getAppointmentDetails(appointment.pk));
            setModalType(type)
            setModalProps(appointment.pk)
        }
        else{
            setModalType(type)
            setModalProps(appointment.pk)
            toggle()
        }
    }

    const onSubmit = () =>{
        console.log(modalProps)
        dispatch(deletePatientAppointment(modalProps))
        toggle()
    }

    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, page, prepareRow } = useTable(
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

    if (props.isLoadingPatients === true) {
        tableComponent = <h1>Loading</h1>;
    } else {
        if (data.length === 0) {
            tableComponent = (
                <div className="row h-75">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">No Patients Scheduled</h3>
                    </div>
                </div>
            );
        } else {
            tableComponent = (
                <table className="table table-striped table-responsive-md" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
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
                    <tfoot>
                        {footerGroups.map((group) => (
                            <tr {...group.getFooterGroupProps()}>
                                {group.headers.map((column) => (
                                    <td {...column.getFooterProps()}>{column.Footer && column.render("Footer")}</td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            );
        }
    }

    return(
    <div className="col-12 rounded h-100">
        {tableComponent}
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Delete Appointment</ModalHeader>
            <ModalBody>Are you sure you want to delete appointment?</ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={onSubmit}>
                    Yes
                </Button>
                <Button color="secondary" onClick={() => toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    </div>
    
    )
}

const mapStateToProps = (state) => ({
    scheduledPatients: state.schedules.scheduledPatients,
    isLoadingPatients: state.schedules.isLoadingPatients,
    selectedSchedule: state.schedules.schedules,
    availablePatients: state.schedules.availablePatients,
    selectedAppointment: state.schedules.selectedAppointment,
    modal: state.modal,
    isLoadingOverlay: state.schedules.isLoadingOverlay,
});

export default connect(mapStateToProps, {})(TableSchedule);
