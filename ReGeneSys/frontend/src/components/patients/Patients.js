import React, { Component, Fragment, useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { PropTypes } from "prop-types";
import {
    getPatients,
    deletePatient,
    editPatient,
} from "../../actions/patients";
import { showPatientModal, hidePatientModal } from "../../actions/modal";
import Form from "./Form";
import EditForm from "./EditForm";
import ViewModal from "./ViewModal";
import { result } from "lodash";

const Patients = (props) => {
    const { getPatients } = props;

    useEffect(() => {
        getPatients();
    }, []);

    const [patients, setPatients] = useState({});
    const [modalAction, setModalAction] = useState({});
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);

    const state = useSelector((state) => state);

    const dispatch = useDispatch();

    function showModal(type, modalProps) {
        dispatch(showPatientModal(type, modalProps));
    }

    // if (state.patients.patients && state.patients.patients.length) {
        return (
            <Fragment>
                <h2>Patient Management</h2>
                <div>
                    <button
                        className="btn btn-primary float-right mb-5"
                        data-toggle="modal"
                        data-target="#addPatientModal"
                        onClick={() => showModal("create", "")}
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
                            <th>DOB </th>
                            <th>Gender</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.patients.patients.map((patient, index) => (
                            <tr key={index}>
                                <td>{patient.patientID}</td>
                                <td>{patient.firstName}</td>
                                <td>{patient.middleName}</td>
                                <td>{patient.lastName}</td>
                                <td>{patient.suffix}</td>
                                <td>{patient.DOB}</td>
                                <td>{patient.gender}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            showModal("view", patient.patientID)
                                        }
                                        className="btn btn-info btn-sm mr-2"
                                        data-toggle="modal"
                                        data-target="#viewPatientModal"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() =>
                                            showModal("edit", patient.patientID)
                                        }
                                        className="btn btn-primary btn-sm mr-2"
                                        data-toggle="modal"
                                        data-target="#editPatientModal"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        // onClick={this.state.deletePatient.bind(
                                        //     this,
                                        //     patient.patientID
                                        // )}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
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
                                    <Form toggleModal={true} />
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
            </Fragment>
        );
    // } else {
    //     return <h1>Loading...</h1>;
    // }
};

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
//                             <th>DOB </th>
//                             <th>Gender</th>
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
//                                 <td>{patient.DOB}</td>
//                                 <td>{patient.gender}</td>
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
    deletePatient,
    editPatient,
    showPatientModal,
    hidePatientModal,
})(Patients);
