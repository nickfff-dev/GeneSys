import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { editPatient } from "../../reducers/patientsSlice";

import { hideModal } from "../../reducers/modalSlice";

function pageInitial() {
    return 1;
}

function EditForm(props) {
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
            const check = trigger(["caseNumber", "patientType", "referringDoctor", "referringService", "referralReason"]);
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
    const modalData = _.find(state.patients.patients, {
        patientId: modalProps,
    });

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const curDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
    const maxDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

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

    const { mothersName, mAddress, mContactNumber, fathersName, fAddress, fContactNumber, altContactName, altAddress, altContactNumber } = contact;

    const { caseNumber, patientType, referringDoctor, referringService, referralReason, status } = clinical;

    const { register, errors, reset, handleSubmit, trigger, getValues } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            patientId: patientId,
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            suffix: suffix,
            sex: sex,
            birthDate: birthDate,
            birthPlace: birthPlace,
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
            caseNumber: caseNumber,
            patientType: patientType,
            referringDoctor: referringDoctor,
            referringService: referringService,
            referralReason: referralReason,
            status: status,
        },
    });

    const onSubmit = (data) => {
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
        };

        const userToUpdate = {
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
        dispatch(editPatient(userToUpdate));
        console.log("update");
        console.log(userToUpdate);
        toggleAll();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="xl" backdrop="static" keyboard={false}>
                <ModalHeader toggle={toggle}>Edit Patient</ModalHeader>
                <ModalBody>
                    <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                        <div id="page-one" className={page === 1 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Patient ID</label>
                                    <input className="form-control" readOnly={true} type="text" name="patientId" ref={register({ required: true })} />
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
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Ambiguous">Ambiguous</option>
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
                                        <option value="Region I">Region I</option>
                                        <option value="CAR">CAR</option>
                                        <option value="Region II">Region II</option>
                                        <option value="Region III">Region III</option>
                                        <option value="Region IV-A">Region IV-A or CALABARZON</option>
                                        <option value="MIMAROPA Region">MIMAROPA Region</option>
                                        <option value="Region V">Region V</option>
                                        <option value="Region VI">Region VI</option>
                                        <option value="Region VII">Region VII</option>
                                        <option value="Region VIII">Region VIII</option>
                                        <option value="Region IX">Region IX</option>
                                        <option value="Region X">Region X</option>
                                        <option value="Region XI">Region XI</option>
                                        <option value="Region XII">Region XII</option>
                                        <option value="Region XIII">Region XIII</option>
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
                                        <option value="Metabolic">Metabolic</option>
                                        <option value="NBS">NBS</option>
                                        <option value="Dysmorphologic">Dysmorphologic</option>
                                        <option value="Pre-Natal">Pre-Natal</option>
                                        <option value="Cancer">Cancer</option>
                                        <option value="Counselling">Counselling</option>
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
                                                value: 500,
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
                        </div>
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
                            onClick={async () => {
                                const pageValid = await validatePage();
                                if (pageValid) {
                                    nextPage();
                                }
                            }}
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

// export class EditForm extends Component {
//     static propTypes = {
//         editPatient: PropTypes.func.isRequired,
//         hideModal: PropTypes.func.isRequired,
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
    hideModal,
})(EditForm);
