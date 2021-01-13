import React, { Fragment, useState, useEffect, useMemo } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

// import { PropTypes } from "prop-types";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";

import { getPatients, dischargePatient, editPatient } from "../../actions/patients";
import { showModal, hideModal } from "../../actions/modal";
import { PATIENT_API } from "../../constants";
import Form from "./Form";
import EditForm from "./EditForm";
import ViewModal from "./ViewModal";
import { result } from "lodash";
import axios from "axios";

const _ = require("lodash");

function generateID() {
    axios.get(PATIENT_API + "generateid").then((res) => {
        return res.data;
    });
}

function Patients(props) {
    const { getPatients } = props;

    useEffect(() => {
        getPatients();
    }, []);

    
    const [modal, setModal] = useState(false);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);

    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const { modalType, modalProps } = state.modal;

    const url = PATIENT_API + "generateid";
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const generatedID = useSWR(url, fetcher).data;

    const [newPatientID, setPatientID] = useState(() => generateID());

    const data = useMemo(() => getPatientData(state.patients.patients), [state.patients.patients]);
    const columns = useMemo(
        () => [
            {
                Header: "Patient ID",
                accessor: "col1", // accessor is the "key" in the data,
            },
            {
                Header: "First Name",
                accessor: "col2",
            },
            {
                Header: "Middle Name",
                accessor: "col3",
            },
            {
                Header: "Last Name",
                accessor: "col4",
            },
            {
                Header: "Suffix",
                accessor: "col5",
            },
            {
                Header: "Birth Date",
                accessor: "col6",
            },
            {
                Header: "Sex",
                accessor: "col7",
            },
            {
                Header: "",
                accessor: "col8",
            },
        ],
        []
    );

    function getPatientData(patients) {
        console.log(patients)
        var allData = [];
        patients.forEach((element) => {
            var row = {
                col1: element.patientId,
                col2: element.firstName,
                col3: element.middleName,
                col4: element.lastName,
                col5: element.suffix,
                col6: element.birthDate,
                col7: element.sex,
                col8: (
                    <div>
                        <button onClick={() => showPatientModal("view", element.patientId)}>view</button>
                        <button onClick={() => showPatientModal("edit", element.patientId)}>edit</button>
                        <button onClick={() => showPatientModal("delete", element.patientId)}>delete</button>
                    </div>
                ),
            };
            allData.push(row);
            console.log(allData)
        });
        return allData;
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

    function showPatientModal(type, modalProps) {
        if (type === "delete") {
            toggle();
            dispatch(showModal(type, modalProps));
        } else {
            dispatch(showModal(type, modalProps));
        }
    }

    const { register, errors, reset, handleSubmit, trigger, getValues } = useForm({
        validateCriteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            status: "",
        },
    });

    const onSubmit = (data) => {
        const { status } = data;

        const modalData = _.find(state.patients.patients, {
            patientId: modalProps,
        });

        const {
            patientId,
            firstName,
            lastName,
            middleName,
            suffix,
            sex,
            birthDate,
            birthPlace,
            streetAdd,
            brgyAdd,
            cityAdd,
            region,
            contact,
            clinical,
        } = modalData;

        clinical.status = status;

        const userToDischarge = {
            patientId,
            firstName,
            lastName,
            middleName,
            suffix,
            sex,
            birthDate,
            birthPlace,
            streetAdd,
            brgyAdd,
            cityAdd,
            region,
            contact,
            clinical,
        };

        dispatch(dischargePatient(userToDischarge));
        toggleAll();
    };

    let tableComponent;

    if (state.schedules.isLoadingPatients === true) {
        tableComponent = <h1>Loading</h1>;
    } else {
        if (data.length === 0) {
            tableComponent = (
                <div className="row h-75">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">No Patients</h3>
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

    return (
        <Fragment>
            <h2>Patient Management</h2>
            <div>
                <button
                    className="btn btn-primary float-right mb-2"
                    data-toggle="modal"
                    data-target="#addPatientModal"
                    onClick={async () => {
                        const newID = generatedID;
                        await showPatientModal("create", newID);
                        mutate(url, { ...generatedID, newID });
                    }}
                >
                    Add Patient
                </button>
            </div>
            {tableComponent}
        <div className="pagination">
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
            {/* <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Suffix</th>
                        <th>Birth Date </th>
                        <th>Sex</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {state.patients.patients.map((patient, index) => (
                        <tr key={index}>
                            <td>{patient.patientId}</td>
                            <td>{patient.firstName}</td>
                            <td>{patient.middleName}</td>
                            <td>{patient.lastName}</td>
                            <td>{patient.suffix}</td>
                            <td>{patient.birthDate}</td>
                            <td>{patient.sex}</td>
                            <td>
                                <button
                                    onClick={() => showPatientModal("view", patient.patientId)}
                                    className="btn btn-info btn-sm mr-2"
                                    data-toggle="modal"
                                    data-target="#viewPatientModal"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => showPatientModal("edit", patient.patientId)}
                                    className="btn btn-primary btn-sm mr-2"
                                    data-toggle="modal"
                                    data-target="#editPatientModal"
                                >
                                    Edit
                                </button>
                                <button
                                    // onClick={toggle}
                                    onClick={() => showPatientModal("delete", patient.patientId)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Discharge
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
            {(() => {
                switch (state.modal.modalMode) {
                    case "create":
                        return (
                            <Fragment>
                                <Form toggleModal={true} newPatientID={newPatientID} />
                            </Fragment>
                        );
                    case "edit":
                        return (
                            <Fragment>
                                <EditForm toggleModal={true} />
                            </Fragment>
                        );
                    case "view":
                        return (
                            <Fragment>
                                <ViewModal toggleModal={true} />
                            </Fragment>
                        );
                    default:
                        return null;
                }
            })()}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Discharge Patient</ModalHeader>
                <ModalBody>
                    <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Select reason for discharging patient.</label>
                                <select id="statusSelect" className="form-control" name="status" ref={register({ required: true })}>
                                    <option value="D">Deceased</option>
                                    <option value="L">Lost to Follow-up</option>
                                    <option value="F">False Positive</option>
                                    <option value="P">Moved to Private</option>
                                </select>
                                <p className="text-error"></p>
                            </div>
                        </div>
                    </form>
                    <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined}>
                        <ModalHeader>Save Changes</ModalHeader>
                        <ModalBody>Are you sure you want to save the changes you made?</ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleSubmit(onSubmit)}>
                                Yes
                            </Button>
                            <Button color="secondary" onClick={() => toggleNested}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggleNested}>
                        Save
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );

}

const mapStateToProps = (state) => ({
    patients: state.patients.patients,
    modal: state.modal,
});

export default connect(mapStateToProps, {
    getPatients,
    dischargePatient,
    editPatient,
    showModal,
    hideModal,
})(Patients);
