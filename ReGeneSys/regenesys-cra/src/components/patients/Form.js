import React, { Component, Fragment, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import _ from "lodash/fp";

import { hideModal } from "../../actions/modal";

import { addPatient } from "../../actions/patients";

function pageInitial() {
    return 1;
}

function AddForm(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);

    const closeModal = () => {
        dispatch(hideModal());
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
        if (page === 1) {
            const check = trigger(["firstName", "lastName", "birthDate", "birthPlace", "sex", "streetAdd", "brgyAdd", "cityAdd", "region"]);

            return check;
        } else if (page === 2) {
            const check = trigger([
                "mothersName",
                "mContactNumber",
                "mAddress",
                "fathersName",
                "fContactNumber",
                "fAddress",
                "altContactName",
                "altContactNumber",
                "altAddress",
            ]);
            return check;
        } else if (page === 3) {
            const check = trigger([
                "caseNumber",
                "patientType",
                "referringDoctor",
                "referringService",
                "referralReason",
                // "gestationAgeWeek",
                // "gestationAgeDay",
                // "birthWeightVal",
                // "birthWeightUnit",
                // "birthHospital",
                // "collectionHospital",
                // "attendingPhys",
                // "attendingContact",
                // "specialistName",
                // "specialistContact",
                // "collectionDate",
                // "sampleReceptionDate",
                // "rSampleReceptionDate",
                // "rCollectionDate",
                // "diagnosis",
                // "diagnosisDate",
                // "treatmentDate",
                // "note",
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
    const dispatch = useDispatch();
    const { modalType, modalProps } = state.modal;

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const curDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
    const maxDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

    const { register, errors, handleSubmit, trigger, getValues } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            patientID: modalProps,
            firstName: "",
            lastName: "",
            middleName: "",
            suffix: "",
            sex: "",
            birthDate: "",
            birthPlace: "",
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
            caseNumber: "",
            patientType: "",
            referringDoctor: "",
            referringService: "",
            referralReason: "",
            status: "",
            // gestationAge: "",
            // birthWeight: "",
            // birthHospital: "",
            // collectionHospital: "",
            // attendingPhys: "",
            // attendingContact: "",
            // specialistName: "",
            // specialistContact: "",
            // collectionDate: "",
            // sampleReceptionDate: "",
            // rCollectionDate: "",
            // rSampleReceptionDate: "",
            // diagnosis: "",
            // diagnosisDate: "",
            // treatmentDate: "",
            // note: "",
        },
    });

    const onSubmit = (data) => {
        const {
            patientID,
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
            mothersName,
            mAddress,
            mContactNumber,
            fathersName,
            fAddress,
            fContactNumber,
            altContactName,
            altAddress,
            altContactNumber,
            caseNumber,
            patientType,
            referringDoctor,
            referringService,
            referralReason,
            status = "active",
            // gestationAge,
            // birthWeight,
            // birthHospital,
            // collectionHospital,
            // attendingPhys,
            // attendingContact,
            // specialistName,
            // specialistContact,
            // collectionDate,
            // sampleReceptionDate,
            // rCollectionDate,
            // rSampleReceptionDate,
            // diagnosis,
            // diagnosisDate,
            // treatmentDate,
            // note,
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
            caseNumber,
            patientType,
            referringDoctor,
            referringService,
            referralReason,
            status,
            // gestationAge,
            // birthWeight,
            // birthHospital,
            // collectionHospital,
            // attendingPhys,
            // attendingContact,
            // specialistName,
            // specialistContact,
            // collectionDate,
            // sampleReceptionDate,
            // rCollectionDate,
            // rSampleReceptionDate,
            // diagnosis,
            // diagnosisDate,
            // treatmentDate,
            // note,
            // status,
        };

        const userToAdd = {
            patientID,
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

        // console.log(userToAdd);
        dispatch(addPatient(userToAdd));
        toggleAll();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="xl" backdrop="static" keyboard={false}>
                <ModalHeader toggle={toggle}>Add Patient</ModalHeader>
                <ModalBody>
                    <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                        <div id="page-one" className={page === 1 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Patient ID</label>
                                    <input className="form-control" readOnly={true} type="text" name="patientID" ref={register({ required: true })} />
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
                                                message: "This input is too short.",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="firstName"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
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
                                                message: "This input is too short.",
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="lastName"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
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
                                                message: "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="middleName"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Suffix</label>
                                    <select id="suffixSelect" className="form-control" name="suffix" ref={register({})}>
                                        <option value="">None</option>
                                        <option value="Jr.">Jr.</option>
                                        <option value="Sr.">Sr.</option>
                                        <option value="II">II</option>
                                        <option value="III">III</option>
                                        <option value="IV">IV</option>
                                        <option value="V">V</option>
                                        <option value="VI">VI</option>
                                        <option value="VII">VII</option>
                                        <option value="VIII">VIII</option>
                                        <option value="IX">IX</option>
                                        <option value="X">X</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label>Date of Birth</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="birthDate"
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
                                                message: "Date cannot be in the future",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="birthDate"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Place of Birth</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="birthPlace"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 75,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="birthPlace"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Sex</label>
                                    <select id="sexSelect" className="form-control" name="sex" ref={register({ required: true })}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="A">Ambiguous</option>
                                    </select>
                                    {errors.sex && <p className="text-danger">Sex is required</p>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-12">
                                    <label>Street Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="streetAdd"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 100,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="streetAdd"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-12">
                                    <label>Barangay Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="brgyAdd"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 100,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="brgyAdd"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>City Address</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="cityAdd"
                                        ref={register({
                                            required: "This input is required.",
                                            maxLength: {
                                                value: 100,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="cityAdd"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <label>Region</label>
                                    <select id="Region" className="form-control" name="region" ref={register({ required: true })}>
                                        <option value="NCR">NCR</option>
                                        <option value="I">Region I</option>
                                        <option value="CAR">CAR</option>
                                        <option value="II">Region II</option>
                                        <option value="III">Region III</option>
                                        <option value="IV-A">Region IV-A or CALABARZON</option>
                                        <option value="MIMAROPA">MIMAROPA Region</option>
                                        <option value="V">Region V</option>
                                        <option value="VI">Region VI</option>
                                        <option value="VII">Region VII</option>
                                        <option value="VIII">Region VIII</option>
                                        <option value="IX">Region IX</option>
                                        <option value="X">Region X</option>
                                        <option value="XI">Region XI</option>
                                        <option value="XII">Region XII</option>
                                        <option value="XIII">Region XIII</option>
                                        <option value="BARMM">BARMM</option>
                                    </select>
                                    {errors.region && <p className="text-danger">Region is required</p>}
                                </div>
                            </div>
                        </div>
                        <div id="page-two" className={page === 2 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Mother's Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="mothersName"
                                        ref={register({
                                            maxLength: {
                                                value: 75,
                                                message: "This input is too long",
                                            },
                                            validate: {
                                                atLeastOne: (value) => {
                                                    const {
                                                        mContactNumber,
                                                        mAddress,
                                                        fathersName,
                                                        fContactNumber,
                                                        fAddress,
                                                        altContactName,
                                                        altContactNumber,
                                                        altAddress,
                                                    } = getValues();
                                                    return (
                                                        value.length > 0 ||
                                                        mContactNumber.length > 0 ||
                                                        mAddress.length > 0 ||
                                                        fathersName.length > 0 ||
                                                        fContactNumber.length > 0 ||
                                                        fAddress.length > 0 ||
                                                        altContactName.length > 0 ||
                                                        altContactNumber.length > 0 ||
                                                        altAddress.length > 0 ||
                                                        "At least one contact should be provided"
                                                    );
                                                },
                                                motherOtherFieldsFilled: (value) => {
                                                    const { mContactNumber, mAddress } = getValues();
                                                    return (
                                                        value.length > 0 ||
                                                        (mContactNumber.length === 0 && mAddress.length === 0) ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    {errors.mothersName && errors.mothersName.type === "motherOtherFieldsFilled" && (
                                        <p className="text-danger">{errors.mothersName.message}</p>
                                    )}
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="mContactNumber"
                                        ref={register({
                                            // pattern: {
                                            //     value:/(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/g,
                                            //     message: "Invalid "
                                            // },
                                            maxLength: {
                                                value: 20,
                                                message: "Input too long",
                                            },
                                            validate: {
                                                mothersNameFilled: (value) => {
                                                    const { mothersName } = getValues();
                                                    return mothersName.length === 0 || value.length > 0 || "This is required";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="mContactNumber"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
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
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                            validate: {
                                                motherFilled: (value) => {
                                                    const { mothersName } = getValues();
                                                    return mothersName.length === 0 || value.length > 0 || "This is required";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="mAddress"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
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
                                        ref={register({
                                            maxLength: {
                                                value: 75,
                                                message: "This input is too long",
                                            },
                                            validate: {
                                                fatherOtherFieldsFilled: (value) => {
                                                    const { fContactNumber, fAddress } = getValues();
                                                    return (
                                                        value.length > 0 ||
                                                        (fContactNumber.length === 0 && fAddress.length === 0) ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="fathersName"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
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
                                                message: "Input too long",
                                            },
                                            validate: {
                                                fathersNameFilled: (value) => {
                                                    const { fathersName } = getValues();
                                                    return fathersName.length === 0 || value.length > 0 || "This is required";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="fContactNumber"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
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
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                            validate: {
                                                motherFilled: (value) => {
                                                    const { fathersName } = getValues();
                                                    return fathersName.length === 0 || value.length > 0 || "This is required";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="fAddress"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
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
                                        ref={register({
                                            maxLength: {
                                                value: 75,
                                                message: "This input is too long",
                                            },
                                            validate: {
                                                altOtherFieldsFilled: (value) => {
                                                    const { altContactNumber, altAddress } = getValues();
                                                    return (
                                                        value.length > 0 ||
                                                        (altContactNumber.length === 0 && altAddress.length === 0) ||
                                                        "This is required"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="altContactName"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="altContactNumber"
                                        ref={register({
                                            // pattern: {
                                            //     value:/(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/g,
                                            //     message: "Invalid "
                                            // },
                                            maxLength: {
                                                value: 20,
                                                message: "Input too long",
                                            },
                                            validate: {
                                                altContactsNameFilled: (value) => {
                                                    const { altContactName, altAddress } = getValues();
                                                    return altContactName.length === 0 || value.length > 0 || "This is required";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="altContactNumber"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
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
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                            validate: {
                                                altFilled: (value) => {
                                                    const { altContactName } = getValues();
                                                    return altContactName.length === 0 || value.length > 0 || "This is required";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="altAddress"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                            </div>
                            {errors.mothersName && errors.mothersName.type === "atLeastOne" && (
                                <p className="text-danger">{errors.mothersName.message}</p>
                            )}
                        </div>

                        <div id="page-three" className={page === 3 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Case Number</label>
                                    <input className="form-control" type="text" name="caseNumber" ref={register()} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Type of Patient</label>
                                    <select
                                        className="form-control"
                                        name="patientType"
                                        ref={register({
                                            required: "This is Required",
                                        })}
                                    >
                                        <option value="M">Metabolic</option>
                                        <option value="N">NBS</option>
                                        <option value="D">Dysmorphologic</option>
                                        <option value="P">Pre-Natal</option>
                                        <option value="C">Cancer</option>
                                        <option value="CN">Counselling</option>
                                    </select>
                                    <ErrorMessage
                                        errors={errors}
                                        name="patientType"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Referring Doctor</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="referringDoctor"
                                        ref={register({ required: "This is required" })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="referringDoctor"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Referring Service</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="referringService"
                                        ref={register({ required: "This is required" })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="referringService"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Reason for Referral</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        name="referralReason"
                                        ref={register({
                                            required: "This is required",
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="referralReason"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger" key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                            </div>
                            {/* <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Working Impression</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="workingImpression"
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="workingImpression">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <p className="text-danger" key={type}>
                                                    {message}
                                                </p>
                                            ))
                                        }
                                    </ErrorMessage>
                                </div>
                            </div> */}
                            {/* <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Medical History</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="medicalHistory"
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="medicalHistory">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <p className="text-danger" key={type}>
                                                    {message}
                                                </p>
                                            ))
                                        }
                                    </ErrorMessage>
                                </div>
                            </div> */}
                            {/* <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Other History</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="otherHistory"
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="otherHistory">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <p className="text-danger" key={type}>
                                                    {message}
                                                </p>
                                            ))
                                        }
                                    </ErrorMessage>
                                </div>
                            </div> */}
                        </div>
                        <div id="page-three" className={page === 4 ? "" : "d-none"}>
                            {/* <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Other History</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="finalDiagnosis"
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message: "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="otherHistory">
                                        {({ messages }) =>
                                            messages &&
                                            Object.entries(messages).map(([type, message]) => (
                                                <p className="text-danger" key={type}>
                                                    {message}
                                                </p>
                                            ))
                                        }
                                    </ErrorMessage>
                                </div>
                            </div> */}
                        </div>

                        {/* <div
                            id="page-three"
                            className={page === 3 ? "" : "d-none"}
                        >
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Gestation Age</label>
                                    <div className="row">
                                        <div className="col-6 pr-0">
                                            <div class="input-group mb-2">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text p-1">
                                                        Weeks
                                                    </div>
                                                </div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    class="form-control"
                                                    id="inlineFormInputGroup"
                                                    name="gestationAgeWeek"
                                                    ref={register({
                                                        required:
                                                            "This input is required.",
                                                        min: {
                                                            value: 0,
                                                            message:
                                                                "This input is invalid",
                                                        },
                                                        max: {
                                                            value: 50,
                                                            message:
                                                                "This input is invalid",
                                                        },
                                                    })}
                                                />
                                            </div>
                                            <ErrorMessage
                                                errors={errors}
                                                name="gestationAgeWeek"
                                            >
                                                {({ messages }) =>
                                                    messages &&
                                                    Object.entries(
                                                        messages
                                                    ).map(([type, message]) => (
                                                        <p
                                                            className="text-danger"
                                                            key={type}
                                                        >
                                                            {message}
                                                        </p>
                                                    ))
                                                }
                                            </ErrorMessage>
                                        </div>
                                        <div className="col-md-6">
                                            <select
                                                className="form-control"
                                                name="gestationAgeDay"
                                                ref={register({
                                                    required:
                                                        "This input is required.",
                                                })}
                                            >
                                                <option value="0">
                                                    0 days
                                                </option>
                                                <option value="1">1 day</option>
                                                <option value="2">
                                                    2 days
                                                </option>
                                                <option value="3">
                                                    3 days
                                                </option>
                                                <option value="4">
                                                    4 days
                                                </option>
                                                <option value="5">
                                                    5 days
                                                </option>
                                                <option value="6">
                                                    6 days
                                                </option>
                                                <option value="7">
                                                    7 days
                                                </option>
                                            </select>
                                        </div>
                                        <ErrorMessage
                                            errors={errors}
                                            name="gestationAgeDay"
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
                                </div>

                                <div className="form-group col-md-6">
                                    <label>Birth Weight</label>
                                    <div className="row">
                                        <div className="col-4 pr-0">
                                            <input
                                                className="form-control"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                name="birthWeightVal"
                                                ref={register({
                                                    required:
                                                        "This input is required.",
                                                    min: {
                                                        value: 0,
                                                        message:
                                                            "This input is invalid",
                                                    },
                                                })}
                                            />
                                        </div>
                                        <ErrorMessage
                                            errors={errors}
                                            name="birthWeightVal"
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
                                        <div className="col-8">
                                            <select
                                                className="form-control"
                                                name="birthWeightUnit"
                                                ref={register({
                                                    required: true,
                                                })}
                                            >
                                                <option value="g">grams</option>
                                                <option value="kg">
                                                    kilograms
                                                </option>
                                            </select>
                                        </div>
                                        <ErrorMessage
                                            errors={errors}
                                            name="birthWeightUnit"
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
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Birth Hospital</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="birthHospital"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="birthHospital"
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
                                <div className="form-group col-6">
                                    <label>Hospital of Collection</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="collectionHospital"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="collectionHospital"
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
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Attending Physician</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="attendingPhys"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="attendingPhys"
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
                                <div className="form-group col-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="attendingContact"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="attendingContact"
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
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Name of Specialist</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="specialistName"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="specialistName"
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
                                <div className="form-group col-6">
                                    <label>Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="specialistContact"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="specialistContact"
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
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-3 col-sm-6">
                                    <label>Date of Initial Collection</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="collectionDate"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="collectionDate"
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
                                <div className="form-group col-md-3 col-sm-6">
                                    <label>
                                        Date First Sample Received at NSC
                                    </label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="sampleReceptionDate"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="sampleReceptionDate"
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
                                <div className="form-group col-md-3 col-sm-6">
                                    <label>Date of Repeat Collection</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="rSampleReceptionDate"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="rSampleReceptionDate"
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
                                <div className="form-group col-md-3 col-sm-6">
                                    <label>
                                        Date Repeat Sample Received at NSC
                                    </label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="rCollectionDate"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="rCollectionDate"
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
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label>Diagnosis</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="diagnosis"
                                        ref={register({
                                            required: true,
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="diagnosis"
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
                                <div className="form-group col-md-4">
                                    <label>Diagnosis Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="diagnosisDate"
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
                                    <ErrorMessage
                                        errors={errors}
                                        name="diagnosisDate"
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
                                <div className="form-group col-md-4">
                                    <label>Treatment Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="treatmentDate"
                                        min="1900-01-01"
                                        max={maxDate}
                                        ref={register({
                                            required: "This input is required.",
                                            max: {
                                                value: curDate,
                                                message:
                                                    "Date cannot be in the future",
                                            },
                                            validate: {
                                                cannotBeBeforeDiagnosis: (
                                                    value
                                                ) => {
                                                    const {
                                                        diagnosisDate,
                                                    } = getValues();
                                                    return (
                                                        value >=
                                                            diagnosisDate ||
                                                        "Must not be before diagnosis date"
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="treatmentDate"
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
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label>Note</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="note"
                                        ref={register({
                                            maxLength: {
                                                value: 225,
                                                message:
                                                    "This input is too long",
                                            },
                                        })}
                                    />
                                    <ErrorMessage errors={errors} name="note">
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
                        </div> */}
                    </form>
                    <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined}>
                        <ModalHeader>Save Changes</ModalHeader>
                        <ModalBody>Are you sure you want to save the changes you made?</ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleSubmit(onSubmit)}>
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
                        <button type="button" onClick={previousPage} className="btn btn-primary">
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
                            //     errors.birthDate,
                            //     errors.birthPlace,
                            //     errors.sex,
                            //     errors.streetAdd,
                            //     errors.brgyAdd,
                            //     errors.cityAdd,
                            //     errors.region)
                            // }
                            // onClick={nextPage}.
                            onClick={async () => {
                                const pageValid = await validatePage();
                                // const curTime = new Date().toLocaleString();
                                // console.log("page valid? " + pageValid);
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
                    {page === 3 && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={async () => {
                                const pageValid = await validatePage();
                                // const curTime = new Date().toLocaleString();
                                console.log("page valid? " + errors);
                                if (pageValid === true) {
                                    toggleNested();
                                }
                            }}
                        >
                            Save
                        </button>
                    )}
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={toggle}>
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
