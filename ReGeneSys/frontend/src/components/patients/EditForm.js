import React, { Component, useState, Fragment } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes from "prop-types";

import _ from "lodash";
import { useForm } from "react-hook-form";

import { addPatient, editPatient } from "../../actions/patients";
import { hidePatientModal } from "../../actions/modal";

function pageInitial() {
    return 1;
}

function EditForm(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);

    const closeModal = () => {
        dispatch(hidePatientModal());
    };

    const toggle = () => {
        setModal(!modal);
        closeModal();
    };
    console.log(props.toggleModal);
    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };
    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    };

    function nextPage() {
        if (page < 3) {
            setPage((prevPage) => prevPage + 1);
        }
    }

    function previousPage() {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    }
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { modalType, modalProps } = state.modal;
    const modalData = _.find(state.patients.patients, {
        patientID: modalProps,
    });

    const {
        patientID,
        caseNumber,
        firstName,
        lastName,
        middleName,
        suffix,
        gender,
        DOB,
        POB,
        streetAdd,
        brgyAdd,
        cityAdd,
        region,
        contact,
        clinical,
    } = modalData;

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

    const {
        gestationAge,
        birthWeight,
        birthHospital,
        collectionHospital,
        attendingPhys,
        attendingContact,
        specialistName,
        specialistContact,
        collectionDate,
        sampleReceptionDate,
        rCollectionDate,
        rSampleReceptionDate,
        diagnosis,
        diagnosisDate,
        treatmentDate,
        note,
        status,
    } = clinical;

    const { register, errors, reset, handleSubmit } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            patientID: patientID,
            caseNumber: caseNumber,
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            suffix: suffix,
            gender: gender,
            DOB: DOB,
            POB: POB,
            streetAdd: streetAdd,
            brgyAdd: brgyAdd,
            cityAdd: cityAdd,
            region: region,
            mothersName: mothersName,
            mAddress: mAddress,
            mContactNumber: mContactNumber,
            fathersName: fathersName,
            fAddress: fAddress,
            fContactNumber: fContactNumber,
            altContactName: altContactName,
            altAddress: altAddress,
            altContactNumber: altContactNumber,
            gestationAge: gestationAge,
            birthWeight: birthWeight,
            birthHospital: birthHospital,
            collectionHospital: collectionHospital,
            attendingPhys: attendingPhys,
            attendingContact: attendingContact,
            specialistName: specialistName,
            specialistContact: specialistContact,
            collectionDate: collectionDate,
            sampleReceptionDate: sampleReceptionDate,
            rCollectionDate: rCollectionDate,
            rSampleReceptionDate: rSampleReceptionDate,
            diagnosis: diagnosis,
            diagnosisDate: diagnosisDate,
            treatmentDate: treatmentDate,
            note: note,
        },
    });

    const onSubmit = (data) => {
        const {
            patientID,
            caseNumber,
            firstName,
            lastName,
            middleName,
            suffix,
            gender,
            DOB,
            POB,
            streetAdd,
            brgyAdd,
            cityAdd,
            region,
            mothersName,
            mAddress,
            mContactNumber,
            fathersName,
            fAddress,
            fContactNumber,
            altContactName,
            altAddress,
            altContactNumber,
            gestationAge,
            birthWeight,
            birthHospital,
            collectionHospital,
            attendingPhys,
            attendingContact,
            specialistName,
            specialistContact,
            collectionDate,
            sampleReceptionDate,
            rCollectionDate,
            rSampleReceptionDate,
            diagnosis,
            diagnosisDate,
            treatmentDate,
            note,
        } = data;

        const contact = {
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
        const clinical = {
            gestationAge,
            birthWeight,
            birthHospital,
            collectionHospital,
            attendingPhys,
            attendingContact,
            specialistName,
            specialistContact,
            collectionDate,
            sampleReceptionDate,
            rCollectionDate,
            rSampleReceptionDate,
            diagnosis,
            diagnosisDate,
            treatmentDate,
            note,
            status,
        };

        const userToUpdate = {
            patientID,
            caseNumber,
            firstName,
            lastName,
            middleName,
            suffix,
            gender,
            DOB,
            POB,
            streetAdd,
            brgyAdd,
            cityAdd,
            region,
            contact,
            clinical,
        };
        dispatch(editPatient(userToUpdate));
        toggleAll();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="xl">
                <ModalHeader toggle={toggle}>Edit Patient</ModalHeader>
                <ModalBody>
                    <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                        <div
                            id="page-one"
                            className={page == 1 ? "" : "d-none"}
                        >
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Patient ID</label>
                                    <input
                                        readOnly={true}
                                        disabled={true}
                                        className="form-control"
                                        type="text"
                                        name="patientID"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Case Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="caseNumber"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label>First Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="firstName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Last Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="lastName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Middle Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="middleName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Suffix</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="suffix"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label>Date of Birth</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="DOB"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Place of Birth</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="POB"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Gender</label>
                                    <select
                                        id="genderSelect"
                                        className="form-control"
                                        name="gender"
                                        ref={register()}
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="A">Ambiguous</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Street Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="streetAdd"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Barangay Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="brgyAdd"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>City Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="cityAdd"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Region</label>
                                    <select
                                        id="Region"
                                        className="form-control"
                                        name="region"
                                        ref={register()}
                                    >
                                        <option value="NCR">NCR</option>
                                        <option value="I">Region I</option>
                                        <option value="CAR">CAR</option>
                                        <option value="II">Region II</option>
                                        <option value="III">Region III</option>
                                        <option value="IV-A">
                                            Region IV-A or CALABARZON
                                        </option>
                                        <option value="MIMAROPA">
                                            MIMAROPA Region
                                        </option>
                                        <option value="V">Region V</option>
                                        <option value="VI">Region VI</option>
                                        <option value="VII">Region VII</option>
                                        <option value="VIII">
                                            Region VIII
                                        </option>
                                        <option value="IX">Region IX</option>
                                        <option value="X">Region X</option>
                                        <option value="XI">Region XI</option>
                                        <option value="XII">Region XII</option>
                                        <option value="XIII">
                                            Region XIII
                                        </option>
                                        <option value="BARMM">BARMM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div
                            id="page-two"
                            className={page == 2 ? "" : "d-none"}
                        >
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Mother's Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="mothersName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="mContactNumber"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="mAddress"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Father's Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="fathersName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="fContactNumber"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="fAddress"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Alternative Contact's Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="altContactName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="altContactNumber"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="altAddress"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            id="page-three"
                            className={page == 3 ? "" : "d-none"}
                        >
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label>Gestation Age</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="gestationAge"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Birth Weight</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="birthWeight"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Birth Hospital</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="birthHospital"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Hospital of Collection</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="collectionHospital"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Attending Physician</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="attendingPhys"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="attendingContact"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Name of Specialist</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="specialistName"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="specialistContact"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label>Date of Initial Collection</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="collectionDate"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>
                                        Date First Sample Received at NSC
                                    </label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="sampleReceptionDate"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Date of Repeat Collection</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="rSampleReceptionDate"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>
                                        Date Repeat Sample Received at NSC
                                    </label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="rCollectionDate"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Diagnosis</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="diagnosis"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Diagnosis Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="diagnosisDate"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Treatment Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="treatmentDate"
                                        ref={register()}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Note</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="note"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                    <Modal
                        isOpen={nestedModal}
                        toggle={toggleNested}
                        onClosed={closeAll ? toggle : undefined}
                    >
                        <ModalHeader>Save Changes</ModalHeader>
                        <ModalBody>
                            Are you sure you want to save the changes you made?
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Yes
                            </Button>
                            <Button color="secondary" onClick={toggleNested}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </ModalBody>
                <ModalFooter>
                    {page > 1 && (
                        <button
                            type="button"
                            onClick={previousPage}
                            className="btn btn-primary"
                        >
                            Previous Page
                        </button>
                    )}
                    {page < 3 && (
                        <button
                            type="button"
                            onClick={nextPage}
                            className="btn btn-primary"
                        >
                            Next Page
                        </button>
                    )}
                    {page == 3 && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={toggleNested}
                        >
                            Save
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                        onClick={toggle}
                        // onClick={(closeModal, reset)}
                    >
                        Close
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

// export class EditForm extends Component {
//     static propTypes = {
//         editPatient: PropTypes.func.isRequired,
//         hidePatientModal: PropTypes.func.isRequired,
//         modal: PropTypes.object.isRequired,
//         patients: PropTypes.array.isRequired,
//     };

//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <Fragment>
//                 <SampleForm />
//             </Fragment>
//         );
//     }
// }
const mapStateToProps = (state) => ({
    patients: state.patients.patients,
    modal: state.modal,
});

export default connect(mapStateToProps, {
    editPatient,
    hidePatientModal,
})(EditForm);
