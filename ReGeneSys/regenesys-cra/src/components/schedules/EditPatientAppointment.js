import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getAvailablePatients, editPatientAppointment, getAppointmentDetails } from "../../actions/schedules";
import { shortenTime, getValueFromArrayOrObject } from "./CalendarSchedule";
import { generateTime } from "./CreatePatientAppointment";
import { hideModal } from "../../actions/modal";

import { format } from "date-fns";

import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import _ from "lodash";

function pageInitial() {
    return 1;
}

function EditPatientAppointment(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);
    const [timeOptions, setTimeOptions] = useState(() => generateTime());

    const dispatch = useDispatch();

    const selectedSchedule = props.selectedSchedule[0];
    var defaultStartTime = [];
    var defaultEndTime = [];
    const startTime = shortenTime(selectedSchedule.event.startTime);
    const endTime = shortenTime(selectedSchedule.event.endTime);
    const scheduledPatients = props.scheduledPatients;
    const selectedAppointment = props.selectedAppointment;
    var selectedAppointmentStartTime;
    var selectedAppointmentEndTime;

    useEffect(() => {
        getDetails();
        getPatients();
        getDefaultTimes();
    }, []);

    useEffect(() => {
        generatePatientOptions(props.availablePatients);
    }, [props.availablePatients]);

    useEffect(() => {
        // selectedAppointmentStartTime = shortenTime(selectedAppointment.startTime);
        // selectedAppointmentEndTime = shortenTime(selectedAppointment.endTime);
        console.log(selectedAppointment.startTime);
    }, [selectedAppointment]);

    const closeModal = () => {
        dispatch(hideModal());
    };

    const getDetails = () => {
        dispatch(getAppointmentDetails(props.modal.modalProps));
    };

    const getPatients = () => {
        dispatch(getAvailablePatients(props.selectedSchedule[0].pk));
    };

    const getDefaultTimes = () => {
        // const timeOptions = generateTimeOptions();
        // const startTime = shortenTime(selectedSchedule.event.startTime);
        // const endTime = shortenTime(selectedSchedule.event.endTime);

        if (defaultStartTime.length < 1) {
            defaultStartTime.push(_.find(timeOptions, ["value", startTime]));
            defaultEndTime.push(_.find(timeOptions, ["value", endTime]));
        }
    };

    const generatePatientOptions = () => {
        let availablePatients = [];
        props.availablePatients.forEach((patient) => {
            availablePatients.push({ value: patient.patientId, label: patient.firstName + " " + patient.lastName });
        });
        return availablePatients;
    };

    const getTimeLimit = () => {
        // let startTime = shortenTime(selectedSchedule.event.startTime);
        // let endTime = shortenTime(selectedSchedule.event.endTime);

        if (defaultStartTime.length < 1) {
            defaultStartTime = _.find(timeOptions, ["value", startTime]);
            defaultEndTime = _.find(timeOptions, ["value", endTime]);
        }
    };

    const generateTimeOptions = (remark) => {
        getTimeLimit();
        let startIndex = _.findIndex(timeOptions, defaultStartTime);
        let endIndex = _.findIndex(timeOptions, defaultEndTime);
        let options = _.cloneDeep(_.slice(timeOptions, [startIndex], [endIndex + 1]));
        // let selectedAppointmentStartTime = shortenTime(selectedAppointment.startTime);
        // let selectedAppointmentEndTime = shortenTime(selectedAppointment.endTime);

        for (let i = 0; i < scheduledPatients.length; i++) {
            // let startTime = shortenTime(scheduledPatients[i].startTime);
            // let endTime = shortenTime(scheduledPatients[i].endTime);

            let startIndex = _.findIndex(options, { value: startTime });
            let endIndex = _.findIndex(options, { value: endTime });
            let selectedAppointmentStartIndex = _.findIndex(options, { value: selectedAppointmentStartTime });
            let selectedAppointmentEndIndex = _.findIndex(options, { value: selectedAppointmentEndTime });
            let index;
            // console.log("lul");
            // console.log(selectedAppointmentStartIndex);
            if (remark === "start") {
                index = startIndex;
            } else {
                index = startIndex + 1;
            }
            for (index; index < endIndex; index++) {
                options[index]["isDisabled"] = true;
            }
        }

        return options;
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
            const check = trigger(["patient", "startTime", "endTime"]);
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
            startTime: "",
            endTime: "",
            appointmentType: "",
            status: "",
        },
    });

    const onSubmit = (data) => {
        const { patient, schedule, physician, startTime, endTime, appointmentType } = data;

        // const date = format(props.modal.modalProps, "yyyy-MM-dd");
        const date = props.modal.modalProps;

        const appointmentToEdit = {
            patient: patient["value"],
            schedule: props.selectedSchedule[0].pk,
            physician: props.selectedSchedule[0].physician[0].id,
            startTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(startTime)),
            endTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(endTime)),
            appointmentType,
            status: "active",
        };

        console.log(appointmentToEdit);
        dispatch(editPatientAppointment(scheduledPatients.pk, appointmentToEdit));
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
                                        options={generatePatientOptions()}
                                        name="patient"
                                        noOptionsMessage={() => "No available physicians"}
                                        placeholder="Select Patient"
                                        className="basic-single"
                                        isClearable
                                        control={control}
                                        rules={{
                                            required: "This is required",
                                        }}
                                    />
                                    {errors.patient?.type === "required" && <p className="text-danger mb-0">This is required</p>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Start Time</label>
                                    <Controller
                                        as={Select}
                                        className="basic-single"
                                        placeholder="Select Start Time"
                                        options={generateTimeOptions("start")}
                                        name="startTime"
                                        control={control}
                                        rules={{
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    const { endTime } = getValues();
                                                    if (endTime != "") {
                                                        return value.value < endTime.value || endTime.value.length === 0 || "Must be before end time";
                                                    }
                                                },
                                            },
                                        }}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="startTime"
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
                                    <Controller
                                        as={Select}
                                        className="basic-single"
                                        placeholder="Select End Time"
                                        options={generateTimeOptions("end")}
                                        name="endTime"
                                        control={control}
                                        rules={{
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    const { startTime } = getValues();
                                                    if (startTime != "") {
                                                        return (
                                                            value.value > startTime.value ||
                                                            startTime.value.length === 0 ||
                                                            "Must be after start time"
                                                        );
                                                    }
                                                },
                                            },
                                        }}
                                    />
                                    {/* <input
                                        className="form-control"
                                        type="time"
                                        name="endTime"
                                        step="300"
                                        ref={register({
                                            required: "This is required",
                                            validate: {},
                                        })}
                                    /> */}
                                    <ErrorMessage
                                        errors={errors}
                                        name="endTime"
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
                            // console.log(pageValid);
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
    selectedAppointment: state.schedules.selectedAppointment,
    modal: state.modal,
});

export default connect(mapStateToProps, {})(EditPatientAppointment);
