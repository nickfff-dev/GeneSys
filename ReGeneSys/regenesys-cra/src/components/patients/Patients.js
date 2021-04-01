import React, { Fragment, useState, useEffect, useMemo } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from "reactstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

// import { PropTypes } from "prop-types";
import { useForm } from "react-hook-form";
import {
    getPatient,
    getPatients,
    dischargePatient,
    deletePatient,
    searchPatients,
    filterPatients,
    toggleLoadingModal,
} from "../../reducers/patientsSlice";
import { showModal, hideModal } from "../../reducers/modalSlice";
import CreateForm from "./CreateForm";
import EditForm from "./EditForm";
import ViewModal from "./ViewModal";
import Spinner from "../../static/images/Spinner.svg";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faEye,
    faEdit,
    faSignOutAlt,
    faTrashAlt,
    faCaretRight,
    faForward,
    faCaretLeft,
    faBackward,
} from "@fortawesome/free-solid-svg-icons";

const _ = require("lodash");

// function generateID() {
//     axios.get(PATIENT_API + "generateid").then((res) => {
//         return res.data;
//     });
// }

function Table({ columns, data }) {
    const filter = useSelector((state) => state.patients.globalFilter);
    const tableProps = useTable(
        {
            columns,
            data,
        },

        useGlobalFilter, // useGlobalFilter!
        useSortBy,
        usePagination
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
        state,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
    } = tableProps;
    useEffect(() => {
        setGlobalFilter(filter);
    }, [filter]);

    return (
        <>
            <div className="table-container" style={{ minHeight: "40em" }}>
                <table className="table table-striped table-bordered table-hover table-responsive-xl" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th className="text-center" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        {/* Add a sort direction indicator */}
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
            <div className="">
                {/* <div>
                    <div>Showing the first {pageSize} results of {rows.length} rows</div>
                    <div>
                        <pre>
                            <code>{JSON.stringify(state.filters, null, 2)}</code>
                        </pre>
                    </div>
                </div> */}
                <div className="pagination d-block text-center">
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
            </div>

            <br />
        </>
    );
}

function Patients(props) {
    useEffect(() => {
        // loadAll();
    }, []);

    const [modal, setModal] = useState(false);
    const [nestedModal, setNestedModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);

    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const { modalType, modalProps } = state.modal;
    const { isLoadingPatients } = state.patients;

    const [generatedPatientId, setGeneratedPatientId] = useState();
    const [globalFilter, setGlobalFilter] = useState();
    const [searchValue, setSearchValue] = useState();
    const [showOverlay, setShowOverlay] = useState();
    const [message, setMessage] = useState();
    const [refineDisabled, setRefineDisabled] = useState(true);

    useEffect(() => {
        console.log(`this is your filter  ${globalFilter}`);
    }, [globalFilter]);

    useEffect(() => {
        setShowOverlay(state.patients.isLoadingModal);
    }, [state.patients.isLoadingModal]);

    useEffect(() => {}, [state.patients.generatedPatientId]);

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
                Header: "Actions",
                accessor: "col8",
                sortable: false,
                filterable: false,
            },
        ],
        []
    );

    function getPatientData(patients) {
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
                    <div className="d-flex flex-nowrap justify-content-around">
                        <button
                            className="btn btn-sm btn-info"
                            data-toggle="tooltip"
                            title="View Patient"
                            onClick={() => showPatientModal("view", element.patientId)}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>

                        <button
                            className="btn btn-sm btn-primary"
                            data-toggle="tooltip"
                            title="Edit Patient"
                            onClick={() => showPatientModal("edit", element.patientId)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            data-toggle="tooltip"
                            title="Discharge Patient"
                            onClick={() => showPatientModal("discharge", element.patientId)}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            data-toggle="tooltip"
                            title="Delete Patient"
                            onClick={() => showPatientModal("delete", element.patientId)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ),
            };
            allData.push(row);
        });
        return allData;
    }

    const toggle = () => {
        setModal(!modal);
    };
    const toggleDelete = () => {
        console.log(deleteModal);
        setDeleteModal(!deleteModal);
        console.log(deleteModal);
    };
    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };
    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    };

    const showPatientModal = async (type, modalProps) => {
        if (type !== "create" && type !== "discharge" && type !== "delete") {
            dispatch(toggleLoadingModal());
            await dispatch(getPatient(modalProps));
        }
        if (type === "discharge") {
            toggle();
        } else if (type === "delete") {
            toggleDelete();
        }
        dispatch(showModal(type, modalProps));
    };

    const { register, errors, reset, handleSubmit, trigger, getValues } = useForm({
        validateCriteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            status: "",
        },
    });

    const validatePage = () => {
        const check = trigger(["status"]);

        return check;
    };

    const onSubmit = (data) => {
        const { status } = data;

        const userToDischarge = {
            patientId: props.modal.modalProps,
            remark: status,
        };

        console.log(userToDischarge);
        dispatch(dischargePatient(userToDischarge));
        toggleAll();
    };

    const onDelete = () => {
        const patientId = props.modal.modalProps;
        dispatch(deletePatient(patientId));
        toggleDelete();
    };

    function handleChange(value) {
        dispatch(filterPatients(value));
    }

    function search(value) {
        dispatch(searchPatients(value));
    }

    const loadAll = () => {
        setSearchValue("");
        dispatch(getPatients());
    };

    let tableComponent;

    if (isLoadingPatients === true) {
        tableComponent = (
            <div className="d-flex flex-flow-column justify-content-center h-100">
                <div className="d-flex justify-content-center">
                    <img className="" src={Spinner}></img>
                </div>
            </div>
        );
    } else {
        if (data.length === 0) {
            tableComponent = (
                <div className="row h-75">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">Please use search bar to search for patients.</h3>
                    </div>
                </div>
            );
        } else {
            tableComponent = <Table columns={columns} data={data} globalFilter={props.globalFilter} />;
        }
    }

    return (
        <Fragment>
            <div className="slinky">
                <h2>Patient Management</h2>

                <div className="row">
                    <div className="col-md-4 col-sm-12 mb-2">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Patient"
                                aria-label="Search for Patient"
                                aria-describedby="basic-addon2"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button" onClick={() => search(searchValue)}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                                <button className="btn btn-outline-primary" type="button" onClick={() => loadAll()}>
                                    Show All
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 mb-2">
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Refine Search"
                                aria-label="Refine Search"
                                onChange={(e) => handleChange(e.target.value)}
                                disabled={data.length === 0}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 mb-2">
                        <button
                            className="btn btn-primary float-right col-xl-5 col-md-12 col-sm-12 col-12"
                            data-toggle="modal"
                            data-target="#addPatientModal"
                            onClick={() => showPatientModal("create", "")}
                        >
                            Add Patient
                        </button>
                    </div>
                </div>

                <div className="registry-container d-flex flex-column justify-content-center" style={{ minHeight: "40em" }}>
                    {tableComponent}
                </div>

                {(showOverlay === true && <div class="loading">Loading&#8230;</div>) ||
                    (() => {
                        switch (state.modal.modalMode) {
                            case "create":
                                return (
                                    <Fragment>
                                        <CreateForm toggleModal={true} />
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
                <Modal isOpen={modal} toggle={toggle} backdrop="static">
                    <ModalHeader toggle={toggle}>Discharge Patient</ModalHeader>
                    <ModalBody>
                        <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-row">
                                <div className="form-group col-12">
                                    <label>Select reason for discharging patient.</label>
                                    <select id="statusSelect" className="form-control" name="status" ref={register({ required: true })}>
                                        <option value="1">Deceased</option>
                                        <option value="2">Lost to Follow-up</option>
                                        <option value="3">False Positive</option>
                                        <option value="4">Moved to Private</option>
                                    </select>
                                    {errors.status && <p className="text-danger">This is required</p>}
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            // onClick={toggleNested}
                            onClick={async () => {
                                const pageValid = await validatePage();
                                if (pageValid) {
                                    toggleNested();
                                }
                            }}
                        >
                            Save
                        </Button>
                        <Button color="secondary" onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined}>
                    <ModalHeader>Save Changes</ModalHeader>
                    <ModalBody>Are you sure you want to save the changes you made?</ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleSubmit(onSubmit)}>
                            Yes
                        </Button>
                        <Button color="secondary" onClick={() => toggleNested()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={deleteModal} toggle={toggleDelete}>
                    <ModalHeader>Delete Patient Record</ModalHeader>
                    <ModalBody>
                        Are you sure you want to <strong>delete</strong> this patient record? This action will be <strong>irreversible</strong>.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => onDelete()}>
                            Yes
                        </Button>
                        <Button color="secondary" onClick={() => toggleDelete()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Fragment>
    );
}

const mapStateToProps = (state) => ({
    patients: state.patients.patients,
    patient: state.patients.patient,
    globalFilter: state.patients.globalFilter,
    modal: state.modal,
});

export default connect(mapStateToProps, {})(Patients);
