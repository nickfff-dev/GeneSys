import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getAvailablePatients, createPatientAppointment } from "../../actions/schedules";

import { format } from "date-fns";

import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import _ from "lodash/fp";

import { hideModal } from "../../actions/modal";

function pageInitial() {
    return 1;
}

function CreatePatientAppointment(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        getPatients();
    }, []);

    const closeModal = () => {
        dispatch(hideModal());
    };

    const getPatients = () => {
        console.log(props.selectedSchedule[0].pk);
        dispatch(getAvailablePatients(props.selectedSchedule[0].pk));
        generateOptions(props.availablePatients);
    };

    const generateOptions = () => {
        const availablePatients = [];
        props.availablePatients.forEach((patient) => {
            availablePatients.push({ value: patient.patientId, label: patient.firstName + " " + patient.lastName });
        });

        return availablePatients;
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

    function nextPage() {
        if (page < 3) {
            if (page === 1) {
            }
            setPage((prevPage) => prevPage + 1);
        }
    }

    function previousPage() {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    }

    const validatePage = () => {
        if (page === 1) {
            const check = trigger(["patient", "timeStart", "timeEnd"]);
            return check;
        }
    };

    const { register, errors, control, handleSubmit, trigger, getValues } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            patient: "",
            schedule: "",
            physician: "",
            timeStart: "",
            timeEnd: "",
            appointmentType: "",
            status: "",
        },
    });

    const onSubmit = (data) => {
        const { patient, schedule, physician, timeStart, timeEnd, appointmentType } = data;

        // const date = format(props.modal.modalProps, "yyyy-MM-dd");
        const date = props.modal.modalProps;

        const appointmentToCreate = {
            patient: patient["value"],
            schedule: props.selectedSchedule[0].pk,
            physician: props.selectedSchedule[0].physician[0].id,
            timeStart: new Date(format(date, "yyyy-MM-dd") + " " + timeStart),
            timeEnd: new Date(format(date, "yyyy-MM-dd") + " " + timeEnd),
            appointmentType,
            status: "active",
        };

        console.log(appointmentToCreate);
        dispatch(createPatientAppointment(appointmentToCreate));
        toggleAll();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="md" backdrop="static" keyboard={false}>
                <ModalHeader toggle={toggle}>
                    Create Patient Appointment for <i>Physician</i>
                </ModalHeader>
                <ModalBody>
                    <form id="create-form" onSubmit={handleSubmit(onSubmit)}>
                        <div id="page-one" className={page === 1 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-12">
                                    <label>Select Patient</label>
                                    <Controller
                                        as={Select}
                                        options={generateOptions()}
                                        name="patient"
                                        noOptionsMessage={() => "No available physicians"}
                                        placeholder="Select Patient"
                                        onChange={setSelectedPatient}
                                        className="basic-single"
                                        isClearable
                                        control={control}
                                        ref={register({
                                            required: "This is required",
                                        })}
                                    />
                                    {errors.patient?.type === "required" && <p className="text-danger mb-0">This is required</p>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Start Time</label>
                                    <input
                                        className="form-control"
                                        type="time"
                                        name="timeStart"
                                        ref={register({
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    const { timeEnd } = getValues();
                                                    console.log(value);
                                                    console.log(timeEnd);
                                                    return value < timeEnd || timeEnd.length === 0 || "Must be before end time";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="timeStart"
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
                                    <label>End Time</label>
                                    <input
                                        className="form-control"
                                        type="time"
                                        name="timeEnd"
                                        step="300"
                                        ref={register({
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    const { timeStart } = getValues();
                                                    console.log(value);
                                                    console.log(timeStart);
                                                    return value > timeStart || timeStart.length === 0 || "Must be after start time";
                                                },
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="timeEnd"
                                        render={({ messages }) => {
                                            console.log("messages", messages);
                                            return messages
                                                ? _.entries(messages).map(([type, message]) => (
                                                      <p className="text-danger " key={type}>
                                                          {message}
                                                      </p>
                                                  ))
                                                : null;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div id="page-two" className={page === 2 ? "" : "d-none"}></div>

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
                    {/* {page > 1 && (
                        <button type="button" onClick={previousPage} className="btn btn-primary">
                            Previous Page
                        </button>
                    )} */}
                    {/* {page < 2 && (
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
                    )} */}
                    {/* {page === 2 && ( */}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={async () => {
                            const pageValid = await validatePage();
                            if (pageValid === true) {
                                toggleNested();
                            }
                            console.log(pageValid);
                        }}
                    >
                        Save
                    </button>
                    {/* )} */}
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={toggle}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => ({
    availablePatients: state.schedules.availablePatients,
    scheduledPatients: state.schedules.scheduledPatients,
    selectedSchedule: state.schedules.schedules,
    modal: state.modal,
});

export default connect(mapStateToProps, { getAvailablePatients })(CreatePatientAppointment);
