import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

// import { editPatientAppointment } from "../../actions/schedules";
import { getAvailablePatients, editPatientAppointment, clearPatientOptions } from "../../reducers/schedulesSlice";
import { shortenTime, getValueFromArrayOrObject } from "./CalendarSchedule";
import { generateTime, timeRangeOverlaps } from "./CreatePatientAppointment";
import { hideModal } from "../../reducers/modalSlice";

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
    const [loadOverlay, setLoadOverlay] = useState(true);

    const state = useSelector((state) => state);

    const dispatch = useDispatch();

    const selectedSchedule = state.schedules.selectedSchedule[0];
    const selectedAppointment = state.schedules.selectedAppointment;
    const scheduledPatients = state.schedules.scheduledPatients;
    var availablePatients = [];
    var limitStartTime = [];
    var limitEndTime = [];
    var defaultStartTime = [];
    var defaultEndTime = [];
    var defaultPatient = [];
    var filteredTimeOptions = [];

    const scheduleStartTime = shortenTime(selectedSchedule.event.startTime);
    const scheduleEndTime = shortenTime(selectedSchedule.event.endTime);
    const selectedAppointmentStartTime = shortenTime(selectedAppointment.startTime);
    const selectedAppointmentEndTime = shortenTime(selectedAppointment.endTime);

    useEffect(() => {
        getPatients();
        getDefaultTimes();
    }, []);

    useEffect(() => {
        getDefaultPatient();
    }, [availablePatients]);

    useEffect(() => {
        generatePatientOptions(state.schedules.availablePatients);
    }, []);

    //gets patients that can be scheduled
    const getPatients = async () => {
        dispatch(getAvailablePatients(selectedSchedule.pk, selectedAppointment.patient.patientId));
    };

    //gets default start and end time of schedule
    const getDefaultTimes = () => {
        defaultStartTime.push(_.find(timeOptions, ["value", selectedAppointmentStartTime]));
        defaultEndTime.push(_.find(timeOptions, ["value", selectedAppointmentEndTime]));
    };

    //sets default patient value for patient dropdown
    const getDefaultPatient = () => {
        defaultPatient.push({
            value: selectedAppointment.patient.patientId,
            label: selectedAppointment.patient.firstName + " " + selectedAppointment.patient.lastName,
        });
        setLoadOverlay();
    };

    //set list of available patients as options for dropdown
    const generatePatientOptions = () => {
        state.schedules.availablePatients.forEach((patient) => {
            availablePatients.push({ value: patient.patientId, label: patient.firstName + " " + patient.lastName });
        });
        return availablePatients;
    };

    //Gets start and end time of schedule and assign to dropdown
    const getTimeLimit = () => {
        limitStartTime = _.find(timeOptions, ["value", scheduleStartTime]);
        limitEndTime = _.find(timeOptions, ["value", scheduleEndTime]);
    };

    const generateTimeOptions = (remark) => {
        getTimeLimit();
        let limitStartIndex = _.findIndex(timeOptions, limitStartTime);
        let limitEndIndex = _.findIndex(timeOptions, limitEndTime);
        filteredTimeOptions = _.cloneDeep(_.slice(timeOptions, [limitStartIndex], [limitEndIndex + 1]));
        let selectedAppointmentStartIndex = _.findIndex(filteredTimeOptions, { value: selectedAppointmentStartTime });
        let selectedAppointmentEndIndex = _.findIndex(filteredTimeOptions, { value: selectedAppointmentEndTime });

        for (let i = 0; i < scheduledPatients.length; i++) {
            let startTime = shortenTime(scheduledPatients[i].startTime);
            let endTime = shortenTime(scheduledPatients[i].endTime);
            let scheduledStartIndex = _.findIndex(filteredTimeOptions, { value: startTime });
            let scheduledEndIndex = _.findIndex(filteredTimeOptions, { value: endTime });
            let index = scheduledStartIndex;
            if (remark === "end") {
                index = scheduledStartIndex + 1;
                if (index <= selectedAppointmentStartIndex || index >= selectedAppointmentEndIndex) {
                    for (index; index < scheduledEndIndex; index++) {
                        filteredTimeOptions[index]["isDisabled"] = true;
                    }
                }
            } else {
                //OK 10-12
                if (selectedAppointmentStartIndex !== index || selectedAppointmentEndIndex !== scheduledEndIndex) {
                    for (index; index < scheduledEndIndex; index++) {
                        filteredTimeOptions[index]["isDisabled"] = true;
                    }
                }
            }
            //PROBLEM: CANNOT STEP BACK END TIME
        }
        return filteredTimeOptions;
    };

    const closeModal = () => {
        dispatch(clearPatientOptions());
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

    //validates textboxees for complying data
    const validatePage = () => {
        if (page === 1) {
            const check = trigger(["patient", "startTime", "endTime"]);
            return check;
        }
    };

    const onSubmit = (data) => {
        const { patient, schedule, physician, startTime, endTime, appointmentType } = data;

        //convert it to date to be formatted because date strings are invalid.
        const date = new Date(state.schedules.selectedAppointment.schedule.event.date);

        const appointmentToEdit = {
            patient: getValueFromArrayOrObject(patient),
            schedule: state.schedules.selectedSchedule[0].pk,
            physician: state.schedules.selectedSchedule[0].physician[0].id,
            startTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(startTime)),
            endTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(endTime)),
            appointmentType,
            status: "active",
        };

        // console.log(appointmentToEdit);
        dispatch(editPatientAppointment(selectedAppointment.pk, appointmentToEdit));
        toggleAll();
    };

    const { register, errors, control, handleSubmit, trigger, getValues } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            patient: defaultPatient,
            schedule: state.schedules.selectedSchedule[0].pk,
            physician: state.schedules.selectedSchedule[0].physician[0].id,
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            appointmentType: "",
            status: "active",
        },
    });

    return (
        <div>
            {(availablePatients.length > 0 && <h1>LOADING</h1>) || (
                <Modal isOpen={modal} toggle={toggle} size="lg" backdrop="static" keyboard={false}>
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
                                            isLoading={state.isLoadingPatients}
                                            name="patient"
                                            noOptionsMessage={() => "No available patients"}
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
                                                        let { endTime } = getValues();
                                                        if (Array.isArray(value) || Array.isArray(endTime)) {
                                                            value = getValueFromArrayOrObject(value);
                                                            endTime = getValueFromArrayOrObject(endTime);
                                                            return value < endTime || endTime.length === 0 || "Must be before end time";
                                                        } else {
                                                            return (
                                                                value.value < endTime.value || endTime.value.length === 0 || "Must be before end time"
                                                            );
                                                        }
                                                    },
                                                    checkIfOverlapping: (value) => {
                                                        let { endTime } = getValues();
                                                        let timeOptions = generateTimeOptions("start");
                                                        let selectedStartIndex = _.findIndex(timeOptions, {
                                                            value: getValueFromArrayOrObject(value),
                                                        });
                                                        let selectedEndIndex = _.findIndex(timeOptions, {
                                                            value: getValueFromArrayOrObject(endTime),
                                                        });
                                                        let defaultStartIndex = _.findIndex(timeOptions, { value: selectedAppointmentStartTime });
                                                        let defaultEndIndex = _.findIndex(timeOptions, { value: selectedAppointmentEndTime });
                                                        let isOverlapping = false;

                                                        //Not include self in checking
                                                        if (
                                                            !(selectedStartIndex >= defaultStartIndex && selectedStartIndex < defaultEndIndex) &&
                                                            selectedEndIndex > defaultStartIndex &&
                                                            selectedEndIndex <= defaultEndIndex
                                                        ) {
                                                            for (let i = 0; i < scheduledPatients.length; i++) {
                                                                let scheduledStartTime = shortenTime(scheduledPatients[i].startTime);
                                                                let scheduledEndTime = shortenTime(scheduledPatients[i].endTime);
                                                                let scheduledStartIndex = _.findIndex(timeOptions, { value: scheduledStartTime });
                                                                let scheduledEndIndex = _.findIndex(timeOptions, { value: scheduledEndTime });
                                                                if (
                                                                    scheduledStartIndex !== defaultStartIndex &&
                                                                    scheduledEndIndex !== defaultEndIndex
                                                                ) {
                                                                    if (
                                                                        timeRangeOverlaps(
                                                                            selectedStartIndex,
                                                                            selectedEndIndex,
                                                                            scheduledStartIndex,
                                                                            scheduledEndIndex,
                                                                            defaultStartIndex,
                                                                            defaultEndIndex
                                                                        )
                                                                    ) {
                                                                        isOverlapping = true;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        if (isOverlapping) {
                                                            return "Schedule overlaps with existing schedules.";
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
                                                    greaterThanStartTime: (value) => {
                                                        let { startTime } = getValues();
                                                        if (Array.isArray(value) || Array.isArray(startTime)) {
                                                            value = getValueFromArrayOrObject(value);
                                                            startTime = getValueFromArrayOrObject(startTime);
                                                            return value > startTime || startTime.length === 0 || "Must be after start time";
                                                        } else {
                                                            return (
                                                                value.value > startTime.value ||
                                                                startTime.value.length === 0 ||
                                                                "Must be after start time"
                                                            );
                                                        }
                                                    },
                                                    checkIfOverlapping: (value) => {
                                                        let { startTime } = getValues();
                                                        let timeOptions = generateTimeOptions("end");
                                                        let selectedStartIndex = _.findIndex(timeOptions, {
                                                            value: getValueFromArrayOrObject(startTime),
                                                        });
                                                        let selectedEndIndex = _.findIndex(timeOptions, { value: getValueFromArrayOrObject(value) });
                                                        let defaultStartIndex = _.findIndex(timeOptions, { value: selectedAppointmentStartTime });
                                                        let defaultEndIndex = _.findIndex(timeOptions, { value: selectedAppointmentEndTime });
                                                        let isOverlapping = false;

                                                        //Not include self in checking
                                                        for (let i = 0; i < scheduledPatients.length; i++) {
                                                            let scheduledStartTime = shortenTime(scheduledPatients[i].startTime);
                                                            let scheduledEndTime = shortenTime(scheduledPatients[i].endTime);
                                                            let scheduledStartIndex = _.findIndex(timeOptions, { value: scheduledStartTime });
                                                            let scheduledEndIndex = _.findIndex(timeOptions, { value: scheduledEndTime });
                                                            if (scheduledStartIndex !== defaultStartIndex && scheduledEndIndex !== defaultEndIndex) {
                                                                if (
                                                                    timeRangeOverlaps(
                                                                        selectedStartIndex,
                                                                        selectedEndIndex,
                                                                        scheduledStartIndex,
                                                                        scheduledEndIndex,
                                                                        defaultStartIndex,
                                                                        defaultEndIndex
                                                                    )
                                                                ) {
                                                                    isOverlapping = true;
                                                                }
                                                            }
                                                        }
                                                        if (isOverlapping) {
                                                            return "Schedule overlaps with existing schedules.";
                                                        }
                                                    },
                                                },
                                            }}
                                        />
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
                            }}
                        >
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => toggle()}>
                            Close
                        </button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
}

// const mapStateToProps = (state) => ({
//     availablePatients: state.schedules.availablePatients,
//     scheduledPatients: state.schedules.scheduledPatients,
//     selectedSchedule: state.schedules.selectedSchedule,
//     selectedAppointment: state.schedules.selectedAppointment,
//     modal: state.modal,
// });

// export default connect(mapStateToProps, {})(EditPatientAppointment);
export default EditPatientAppointment;
