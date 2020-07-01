import React, { Component, Fragment, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropTypes, { func } from "prop-types";
import { useForm, ErrorMessage } from "react-hook-form";
import { hidePatientModal } from "../../actions/modal";
import toggle from "./Patients";

import { addPatient } from "../../actions/patients";
import { isEmpty } from "lodash";

function pageInitial() {
    return 1;
}

function AddForm(props) {
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

    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };
    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    };

    const validatePage = () => {
        console.log(errors)
        if (page == 1) {
            const check = triggerValidation([
                "firstName",
                "lastName",
                "DOB",
                "POB",
                "gender",
                "streetAdd",
                "brgyAdd",
                "cityAdd",
                "region",
            ]);
            return check;
        } else if (page == 2) {
            const check = triggerValidation([
                "mothersName",
                "mContactNumber",
                "mAddress",
                "fatthersName",
                "fContactNumber",
                "fAddress",
                "altContactName",
                "altContactNumber",
                "altAddress",
            ]);
            return check;
        }
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

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const curDate =
        today.getMonth() +
        1 +
        "/" +
        today.getDate() +
        "/" +
        today.getFullYear();
    const maxDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

    const dispatch = useDispatch();

    const {
        register,
        errors,
        reset,
        handleSubmit,
        triggerValidation,
        getValues,
    } = useForm({
        validateCriteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            patientID: "",
            caseNumber: "",
            firstName: "",
            lastName: "",
            middleName: "",
            suffix: "",
            gender: "",
            DOB: "",
            POB: "",
            streetAdd: "",
            brgyAdd: "",
            cityAdd: "",
            region: "",
            mothersName: "",
            mAddress: "",
            mContactNumber: "",
            fathersName: "",
            fAddress: "",
            fContactNumber: "",
            altContactName: "",
            altAddress: "",
            altContactNumber: "",
            gestationAge: "",
            birthWeight: "",
            birthHospital: "",
            collectionHospital: "",
            attendingPhys: "",
            attendingContact: "",
            specialistName: "",
            specialistContact: "",
            collectionDate: "",
            sampleReceptionDate: "",
            rCollectionDate: "",
            rSampleReceptionDate: "",
            diagnosis: "",
            diagnosisDate: "",
            treatmentDate: "",
            note: "",
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

        const userToAdd = {
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

        // console.log(userToAdd);
        dispatch(addPatient(userToAdd));
        toggleAll();
    };

    return (
        <div>
            <Modal
                isOpen={modal}
                toggle={toggle}
                size="xl"
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader toggle={toggle}>Add Patient</ModalHeader>
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
                                        className="form-control"
                                        type="text"
                                        name="patientID"
                                        ref={register({ required: true })}
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
                                        ref={register({
                                            required: "This input is required.",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "This input is too short.",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="firstName"
                                    >
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Last Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="lastName"
                                        ref={register({
                                            required: "This input is required.",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "This input is too short.",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="lastName"
                                    >
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Middle Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="middleName"
                                        ref={register({
                                            maxLength: {
                                                value: 50,
                                                message:
                                                    "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="middleName"
                                    >
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Suffix</label>
                                    <select
                                        id="suffixSelect"
                                        className="form-control"
                                        name="suffix"
                                        ref={register({})}
                                    >
                                        <option value="M">Jr.</option>
                                        <option value="F">Sr.</option>
                                        <option value="A">II</option>
                                        <option value="M">III</option>
                                        <option value="F">IV</option>
                                        <option value="A">V</option>
                                        <option value="M">VI</option>
                                        <option value="F">VII</option>
                                        <option value="A">VIII</option>
                                        <option value="F">IX</option>
                                        <option value="A">X</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label>Date of Birth</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="DOB"
                                        min="1900-01-01"
                                        max={maxDate}                                       
                                        ref={register({
                                            required: "This input is required.",
                                            min: {
                                                value: "01/01/1900",
                                                message: "Invalid date",
                                            },
                                            max: {
                                                value: curDate,
                                                message:
                                                    "Date cannot be in the future",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="DOB">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Place of Birth</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="POB"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 75,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="POB">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Gender</label>
                                    <select
                                        id="genderSelect"
                                        className="form-control"
                                        name="gender"
                                        ref={register({ required: true })}
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="A">Ambiguous</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="text-danger">
                                            Gender is required
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Street Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="streetAdd"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="streetAdd">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Barangay Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="brgyAdd"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="brgyAdd">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>City Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="cityAdd"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 100,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="cityAdd">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Region</label>
                                    <select
                                        id="Region"
                                        className="form-control"
                                        name="region"
                                        ref={register({ required: true })}
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
                                    {errors.region && (
                                        <p className="text-danger">
                                            Region is required
                                        </p>
                                    )}
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
                                        ref={register({
                                            maxLength:{
                                                value: 75,
                                                message: "This input is too long"
                                            },                                            
                                            validate: {
                                                atLeastOne: (value) => {
                                                    const {
                                                        mContactNumber,mAddress,
                                                        fathersName, fContactNumber, fAddress,
                                                        altContactName, altContactNumber, altAddress
                                                    } = getValues();
                                                    return (
                                                        value.length > 0 || mContactNumber.length > 0 || mAddress.length > 0 ||
                                                        fathersName.length > 0 || fContactNumber.length > 0 || fAddress.length > 0 ||
                                                        altContactName.length > 0 || altContactNumber.length > 0 || altAddress.length > 0 ||
                                                        "At least one contact should be provided"
                                                    );
                                                },
                                                motherOtherFieldsFilled: (value) => {
                                                    const {
                                                        mContactNumber,
                                                        mAddress,
                                                    } = getValues();
                                                    return (
                                                        (value.length > 0 || (mContactNumber.length == 0 &&  mAddress.length == 0)) ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />

                                    {errors.mothersName && errors.mothersName.type === "otherFieldsFilled" && (
                                        <p className="text-danger">
                                            {errors.mothersName.message}
                                        </p>
                                    )}

                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="mContactNumber"
                                        ref={register({
                                            // pattern: {
                                            //     value:/(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/g,
                                            //     message: "Invalid "
                                            // },
                                            maxLength: {                                                
                                                value: 20,
                                                message: "Input too long"

                                            },
                                            validate: {
                                                mothersNameFilled: (value) => {
                                                    const {
                                                        mothersName,
                                                    } = getValues();
                                                    return (
                                                        mothersName.length ==
                                                            0 ||
                                                        value.length > 0 ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="mContactNumber">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="mAddress"
                                        ref={register({
                                            maxLength:{
                                                value: 225,
                                                message: "This input is too long"
                                            },
                                            validate: {
                                                motherFilled: (value) => {
                                                    const {
                                                        mothersName,
                                                    } = getValues();
                                                    return (
                                                        mothersName.length ==
                                                            0 ||
                                                        value.length > 0 ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="mAddress">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Father's Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="fathersName"
                                        ref={register({
                                            maxLength:{
                                                value: 75,
                                                message: "This input is too long"
                                            },                                            
                                            validate: {
                                                fatherOtherFieldsFilled: (value) => {
                                                    const {
                                                        fContactNumber,
                                                        fAddress,
                                                    } = getValues();
                                                    return (
                                                        (value.length > 0 || (fContactNumber.length == 0 &&  fAddress.length == 0)) ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="fathersName">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="fContactNumber"
                                        ref={register({
                                            // pattern: {
                                            //     value:/(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/g,
                                            //     message: "Invalid "
                                            // },
                                            maxLength: {                                                
                                                value: 20,
                                                message: "Input too long"

                                            },
                                            validate: {
                                                fathersNameFilled: (value) => {
                                                    const {
                                                        fathersName,
                                                    } = getValues();
                                                    return (
                                                        fathersName.length ==
                                                            0 ||
                                                        value.length > 0 ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="fContactNumber">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="fAddress"
                                        ref={register({
                                            maxLength:{
                                                value: 225,
                                                message: "This input is too long"
                                            },
                                            validate: {
                                                motherFilled: (value) => {
                                                    const {
                                                        fathersName,
                                                    } = getValues();
                                                    return (
                                                        fathersName.length ==
                                                            0 ||
                                                        value.length > 0 ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="fAddress">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(
                                                ([type, message]) => (
                                                    <p
                                                        className="text-danger"
                                                        key={type}
                                                    >
                                                        {message}
                                                    </p>
                                                )
                                            )
                                        }
                                    </ErrorMessage>
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
                                        name="altAddress"
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            {errors.mothersName &&
                                errors.mothersName.type == "atLeastOne" && (
                                    <p className="text-danger">
                                        {errors.mothersName.message}
                                    </p>
                                )}
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
                            className="btn btn-primary"
                            // disabled={
                            //     (errors.firstName,
                            //     errors.lastName,
                            //     errors.DOB,
                            //     errors.POB,
                            //     errors.gender,
                            //     errors.streetAdd,
                            //     errors.brgyAdd,
                            //     errors.cityAdd,
                            //     errors.region)
                            // }
                            // onClick={nextPage}.
                            onClick={async () => {
                                const pageValid = await validatePage();
                                const curTime = new Date().toLocaleString();
                                console.log("page valid? " + pageValid);
                                if (pageValid) {
                                    nextPage();
                                }
                            }}
                            // onClick={async () => {
                            //     const pageValid = await triggerValidation([
                            //         "firstName",
                            //         "lastName",
                            //     ]);
                            //     console.log(pageValid);
                            //     if (pageValid) {
                            //         nextPage();
                            //     }
                            // }}
                            // onClick={async () => {
                            //     console.log(
                            //         "firstName",
                            //         await triggerValidation("firstName")
                            //     );
                            // }}
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

export class Form extends Component {
    render() {
        return (
            <Fragment>
                <AddForm />
            </Fragment>
        );
    }
}

export default connect(null, { addPatient })(AddForm);
