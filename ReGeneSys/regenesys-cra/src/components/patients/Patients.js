import React, { Fragment, useState, useEffect, useMemo } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

// import { PropTypes } from "prop-types";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";

import { snakeCaseKeysToCamel, camelCaseKeysToSnake } from "../../actions/utils";
import { getPatient, getPatients, dischargePatient, searchPatients, filterPatients } from "../../reducers/patientsSlice";
import { showModal, hideModal } from "../../reducers/modalSlice";
import { PATIENT_API } from "../../constants";
import Form from "./Form";
import EditForm from "./EditForm";
import ViewModal from "./ViewModal";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const _ = require("lodash");

function generateID() {
    axios.get(PATIENT_API + "generateid").then((res) => {
        return res.data;
    });
}

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
            {/* <input
                id="globalFilterTextBox"
                type="text"
                value={globalFilter || ""}
                onChange={e => setGlobalFilter(e.target.value)}
            /> */}
            <table className="table table-striped table-responsive-md" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    {/* Add a sort direction indicator */}
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
            </table>
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
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {"<<"}
                    </button>{" "}
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {"<"}
                    </button>{" "}
                    <span>
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {">"}
                    </button>{" "}
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {">>"}
                    </button>{" "}
                </div>
            </div>

            <br />
        </>
    );
}

function Patients(props) {
    useEffect(() => {
        loadAll();
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
    const [globalFilter, setGlobalFilter] = useState();
    const [searchValue, setSearchValue] = useState();

    useEffect(() => {
        console.log(`this is your filter  ${globalFilter}`);
    }, [globalFilter]);

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
                    <div>
                        <button onClick={() => showPatientModal("view", element.patientId)}>view</button>
                        <button onClick={() => showPatientModal("edit", element.patientId)}>edit</button>
                        <button onClick={() => showPatientModal("delete", element.patientId)}>delete</button>
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
        } else {
        }
        dispatch(getPatient(modalProps));
        dispatch(showModal(type, modalProps));
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
        } = props.patient;

        const { caseNumber, patientType, referringDoctor, referringService, referralReason } = clinical;
        const {
            mothersName,
            mAddress,
            mContactNumber,
            fathersName,
            fAddress,
            fContactNumber,
            altContactName,
            altAddress,
            altContactNumber,
        } = contact;

        var clinicalNew = {
            caseNumber,
            patientType,
            referringDoctor,
            referringService,
            referralReason,
            status,
        };

        var contactNew = {
            mothersName,
            mAddress,
            mContactNumber,
            fathersName,
            fAddress,
            fContactNumber,
            altContactName,
            altAddress,
            altContactNumber,
        };

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
            contact: camelCaseKeysToSnake(contactNew),
            clinical: camelCaseKeysToSnake(clinicalNew),
        };

        console.log(userToDischarge);
        dispatch(dischargePatient(userToDischarge));
        toggleAll();
    };

    function handleChange(value) {
        dispatch(filterPatients(value));
    }

    function search(value) {
        dispatch(searchPatients(value));
    }

    function loadAll() {
        dispatch(getPatients());
    }

    let tableComponent;

    if (state.patients.isLoadingPatients === true) {
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
            tableComponent = <Table columns={columns} data={data} globalFilter={props.globalFilter} />;
        }
    }

    return (
        <Fragment>
            <div className="slinky">
                <h2>Patient Management</h2>

                <div className="row">
                    <div className="col-md-3 col-sm-12 mb-2">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Patient"
                                aria-label="Search for Patient"
                                aria-describedby="basic-addon2"
                                onChange={(event) => setSearchValue(event.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button" onClick={() => search(searchValue)}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                                <button className="btn btn-outline-primary" type="button" onClick={() => loadAll()}>
                                    Load All
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-2">
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Refine Search"
                                aria-label="Refine Search"
                                onChange={(e) => handleChange(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-2">
                        <div className="input-group">
                            <input className="form-control" type="text" onChange={(e) => handleChange(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12">
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
                </div>

                <div className="registry-table-container">{tableComponent}</div>
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
                                <div className="form-group col-12">
                                    <label>Select reason for discharging patient.</label>
                                    <select id="statusSelect" className="form-control" name="status" ref={register({ required: true })}>
                                        <option value="Deceased">Deceased</option>
                                        <option value="Lost to Follow-up">Lost to Follow-up</option>
                                        <option value="False Postive">False Positive</option>
                                        <option value="Moved to Private">Moved to Private</option>
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
