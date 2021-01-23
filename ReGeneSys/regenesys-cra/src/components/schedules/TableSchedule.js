import React, { useMemo, useEffect, useState, useRef, usePrevious } from "react";
import { connect, useDispatch } from "react-redux";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


import { format } from "date-fns";
import { split } from "lodash";
import { shortenTime } from "./CalendarSchedule";
import { showModal } from "../../actions/modal";
import { showOverlay, hideOverlay, getAppointmentDetails, getAvailablePatients, deletePatientAppointment} from "../../actions/schedules";

function usePreviousSelection(schedule) {
    const ref = useRef();

    useEffect(() => {
        ref.current = schedule;
    })

    return ref.current
}

function TableSchedule(props) {
    const [modal, setModal] = useState(false);
    const [modalType, setModalType] = useState();
    const [modalProps, setModalProps] = useState();
    const [tableMessage, setTableMessage] = useState("Please Select a Date")
    const [selectedSchedule, setSelectedSchedule] = useState()
    const prevSelectedSchedule = usePreviousSelection(props.selectedSchedule)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideOverlay())
    }, [props.availablePatients.length !== 0 && props.selectedAppointment !== 0])

    useEffect(() => {
        dispatch(showModal(modalType, modalProps))
    }, [props.isLoadingOverlay == false])

    useEffect(() => {
        if(props.newDateSelected && props.selectedSchedulePhysician === null){
            setTableMessage("Please Select a Schedule")
        }
        else if(props.selectedSchedulePhysician && props.scheduledPatients.length === 0){
            setTableMessage("No Scheduled Patients")
        }
    })

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
            var row = {
                col1: shortenTime(element.startTime, timeFormat) + " - " + shortenTime(element.endTime, timeFormat),
                col2: element.patient.firstName ,
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

    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, page, prepareRow, canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex }} = useTable(
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
         if(data.length === 0){
            tableComponent = (
                <div className="row h-75">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">{tableMessage}</h3>
                    </div>
                </div>
            );
        }
        else {
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
        <div className="pagination d-block text-center">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        
        {/* <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '} */}
        {/* <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>    
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
    newDateSelected: state.schedules.newDateSelected,
    selectedSchedulePhysician: state.schedules.selectedSchedulePhysician,
    isLoadingOverlay: state.schedules.isLoadingOverlay,
});

export default connect(mapStateToProps, {})(TableSchedule);
