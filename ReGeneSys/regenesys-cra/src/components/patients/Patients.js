import React, { Fragment, useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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

    const url = PATIENT_API + "generateid";
    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const [newPatientID, setPatientID] = useState(() => generateID());

    const { data } = useSWR(url, fetcher);

    const state = useSelector((state) => state);

    const { modalType, modalProps } = state.modal;

    const dispatch = useDispatch();

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

    // function remove(patientID) {
    //     console.log(patientID);

    //     status = toggleAll();
    //     // dispatch(dischargePatient(patientID));
    // }

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

        // const { caseNumber, patientType, referringDoctor, referringService, referralReason } = clinical;

        // clinical = {
        //     caseNumber,
        //     patientType,
        //     referringDoctor,
        //     referringService,
        //     referralReason,
        //     status,
        // };

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

        console.log(userToDischarge);
        dispatch(dischargePatient(userToDischarge));
        toggleAll();
    };

    return (
        <Fragment>
            <h2>Patient Management</h2>
            <div>
                <button
                    className="btn btn-primary float-right mb-5"
                    data-toggle="modal"
                    data-target="#addPatientModal"
                    onClick={async () => {
                        const newID = data;
                        await showPatientModal("create", newID);
                        mutate(url, { ...data, newID });
                    }}
                >
                    Add Patient
                </button>
            </div>
            <table className="table table-striped">
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
            </table>
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
    // } else {
    //     return <h1>Loading...</h1>;
    // }
}

// export class Patients extends Component {
//     static propTypes = {
//         patients: PropTypes.array.isRequired,
//         getPatients: PropTypes.func.isRequired,
//         deletePatient: PropTypes.func.isRequired,
//         editPatient: PropTypes.func.isRequired,
//         showPatientModal: PropTypes.func.isRequired,
//         hidePatientModal: PropTypes.func.isRequired,
//         modal: PropTypes.object.isRequired,
//     };

//     componentDidMount() {
//         this.props.getPatients();
//     }

//     render() {
//         return (
//             <Fragment>
//                 <h2>Patients</h2>
//                 <div>
//                     <button
//                         className="btn btn-primary float-right mb-5"
//                         data-toggle="modal"
//                         data-target="#addPatientModal"
//                         onClick={this.props.showPatientModal.bind(
//                             this,
//                             "create",
//                             null
//                         )}
//                     >
//                         Add Patient
//                     </button>
//                 </div>
//                 <table className="table table-striped">
//                     <thead>
//                         <tr>
//                             <th>Patient ID</th>
//                             <th>First Name</th>
//                             <th>Middle Name</th>
//                             <th>Last Name</th>
//                             <th>Suffix</th>
//                             <th>birthDate </th>
//                             <th>sex</th>
//                             <th></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {this.props.patients.map((patient, index) => (
//                             <tr key={index}>
//                                 <td>{patient.patientID}</td>
//                                 <td>{patient.firstName}</td>
//                                 <td>{patient.middleName}</td>
//                                 <td>{patient.lastName}</td>
//                                 <td>{patient.suffix}</td>
//                                 <td>{patient.birthDate}</td>
//                                 <td>{patient.sex}</td>
//                                 <td>
//                                     <button
//                                         onClick={this.props.showPatientModal.bind(
//                                             this,
//                                             "view",
//                                             patient.patientID
//                                         )}
//                                         className="btn btn-info btn-sm mr-2"
//                                         data-toggle="modal"
//                                         data-target="#viewPatientModal"
//                                     >
//                                         View
//                                     </button>
//                                     <button
//                                         onClick={this.props.showPatientModal.bind(
//                                             this,
//                                             "edit",
//                                             patient.patientID
//                                         )}
//                                         className="btn btn-primary btn-sm mr-2"
//                                         data-toggle="modal"
//                                         data-target="#editPatientModal"
//                                     >
//                                         Edit
//                                     </button>
//                                     <button
//                                         onClick={this.props.deletePatient.bind(
//                                             this,
//                                             patient.patientID
//                                         )}
//                                         className="btn btn-danger btn-sm"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 {(() => {
//                     switch (this.props.modal.modalMode) {
//                         case "create":
//                             return (
//                                 <Fragment>
//                                     <Form />
//                                 </Fragment>
//                             );
//                         case "edit":
//                             return (
//                                 <Fragment>
//                                     <EditForm />
//                                 </Fragment>
//                             );
//                         case "view":
//                             return (
//                                 <Fragment>
//                                     <ViewModal />
//                                 </Fragment>
//                             );
//                         default:
//                             return null;
//                     }
//                 })()}
//             </Fragment>
//         );
//     }
// }

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
