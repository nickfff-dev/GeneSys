import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getAvailablePatients, createPatientAppointment, clearPatientOptions } from "../../reducers/schedulesSlice";
import { shortenTime, getValueFromArrayOrObject } from "./CalendarSchedule";
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

//checks selected start and end time options for conflicts with existing schedules
export const timeRangeOverlaps = (selectedStart, selectedEnd, scheduledStart, scheduledEnd, defaultStart, defaultEnd) => {
    //Not include self in checking
    if (selectedStart >= scheduledStart && selectedStart < scheduledEnd) {
        console.log("selected start time is in existing sched");
        return true;
    }
    //if selected start time is in existing sched
    if (selectedEnd > scheduledStart && selectedEnd <= scheduledEnd && scheduledEnd) {
        console.log("selected end time is in existing sched");
        return true;
    }
    //if selected end time is in existing sched
    if (scheduledStart > selectedStart && scheduledEnd < selectedEnd) {
        console.log("schedules are inside selected time range");
        return true;
    } //if schedules are inside selected time range.

    return false;
};

//Generates array time options (30 min interval) for react-select
export const generateTime = () => {
    let timeOptions = [];
    let halfHours = ["00", "30"];
    for (var i = 0; i < 24; i++) {
        for (var j = 0; j < halfHours.length; j++) {
            if (i < 12) {
                if (i === 0) {
                    var hourLabel = 12 + ":" + halfHours[j] + " AM";
                }
                var hourLabel = i + ":" + halfHours[j] + " AM";
            } else if (i === 12) {
                var hourLabel = i + ":" + halfHours[j] + " PM";
            } else {
                var hourLabel = i - 12 + ":" + halfHours[j] + " PM";
            }
            var hourValue = i + ":" + halfHours[j];
            if (i < 10) {
                hourValue = "0" + hourValue;
            }
            timeOptions.push({ value: hourValue, label: hourLabel });
        }
    }
    return timeOptions;
};

function CreatePatientAppointment(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState([]);
    const [timeOptions, setTimeOptions] = useState(() => generateTime());

    const state = useSelector((state) => state);
    const dispatch = useDispatch();

    const selectedSchedule = state.schedules.selectedSchedule[0];
    const scheduledPatients = state.schedules.scheduledPatients;
    var defaultStartTime = [];
    var defaultEndTime = [];

    var time = [];

    useEffect(() => {
        getTimeLimit();
        getPatients();
        generateTime();
    }, []);

    useEffect(() => {
        generatePatientOptions(state.schedules.availablePatients);
    }, [state.schedules.availablePatients]);

    const closeModal = () => {
        dispatch(clearPatientOptions());
        dispatch(hideModal());
    };

    const getPatients = () => {
        dispatch(getAvailablePatients(state.schedules.selectedSchedule[0].pk));
    };

    const generatePatientOptions = () => {
        const availablePatients = [];
        state.schedules.availablePatients.forEach((patient) => {
            availablePatients.push({ value: patient.patientId, label: patient.firstName + " " + patient.lastName });
        });
        return availablePatients;
    };

    const getTimeLimit = () => {
        let startTime = shortenTime(selectedSchedule.event.startTime);
        let endTime = shortenTime(selectedSchedule.event.endTime);

        if (defaultStartTime.length < 1) {
            defaultStartTime = _.find(timeOptions, ["value", startTime]);
            defaultEndTime = _.find(timeOptions, ["value", endTime]);
        }
    };

    const generateTimeOptions = () => {
        getTimeLimit();
        let startIndex = _.findIndex(timeOptions, defaultStartTime);
        let endIndex = _.findIndex(timeOptions, defaultEndTime);
        let options = _.slice(timeOptions, [startIndex], [endIndex + 1]);
        let scheduledPatients = state.schedules.scheduledPatients;

        for (let i = 0; i < scheduledPatients.length; i++) {
            let startTime = shortenTime(scheduledPatients[i].startTime);
            let endTime = shortenTime(scheduledPatients[i].endTime);
            let startIndex = _.findIndex(options, { value: startTime });
            let endIndex = _.findIndex(options, { value: endTime });
            let index = startIndex;

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
        const date = new Date(state.modal.modalProps);

        const appointmentToCreate = {
            patient: patient["value"],
            schedule: state.schedules.selectedSchedule[0].pk,
            physician: state.schedules.selectedSchedulePhysician,
            startTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(startTime)),
            endTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(endTime)),
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
                                        options={generatePatientOptions()}
                                        isLoading={state.schedules.isLoadingPatients}
                                        name="patient"
                                        noOptionsMessage={() => "No available patients"}
                                        placeholder="Select Patient"
                                        onChange={setSelectedPatient}
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
                                                checkIfOverlapping: (value) => {
                                                    let { endTime } = getValues();
                                                    let timeOptions = generateTimeOptions();
                                                    let selectedStartIndex = _.findIndex(timeOptions, { value: getValueFromArrayOrObject(value) });
                                                    let selectedEndIndex = _.findIndex(timeOptions, { value: getValueFromArrayOrObject(endTime) });
                                                    // let defaultStartIndex = _.findIndex(timeOptions, { value: selectedAppointmentStartTime});
                                                    // let defaultEndIndex = _.findIndex(timeOptions, { value: selectedAppointmentEndTime});
                                                    let isOverlapping = false;

                                                    //Not include self in checking
                                                    // if (!(selectedStartIndex >= defaultStartIndex && selectedStartIndex < defaultEndIndex) && (selectedEndIndex > defaultStartIndex && selectedEndIndex <= defaultEndIndex)){
                                                    for (let i = 0; i < scheduledPatients.length; i++) {
                                                        let scheduledStartTime = shortenTime(scheduledPatients[i].startTime);
                                                        let scheduledEndTime = shortenTime(scheduledPatients[i].endTime);
                                                        let scheduledStartIndex = _.findIndex(timeOptions, { value: scheduledStartTime });
                                                        let scheduledEndIndex = _.findIndex(timeOptions, { value: scheduledEndTime });
                                                        // if(scheduledStartIndex !== defaultStartIndex && scheduledEndIndex !== defaultEndIndex){
                                                        if (
                                                            timeRangeOverlaps(
                                                                selectedStartIndex,
                                                                selectedEndIndex,
                                                                scheduledStartIndex,
                                                                scheduledEndIndex
                                                            )
                                                        ) {
                                                            isOverlapping = true;
                                                        }
                                                        // }
                                                    }
                                                    // }
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
                                                    const { startTime } = getValues();
                                                    console.log("create");
                                                    console.log(startTime.value);
                                                    console.log(value.value);
                                                    if (startTime != "") {
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
                                                    // let defaultStartIndex = _.findIndex(timeOptions, { value: selectedAppointmentStartTime});
                                                    // let defaultEndIndex = _.findIndex(timeOptions, { value: selectedAppointmentEndTime});
                                                    let isOverlapping = false;

                                                    //Not include self in checking
                                                    for (let i = 0; i < scheduledPatients.length; i++) {
                                                        let scheduledStartTime = shortenTime(scheduledPatients[i].startTime);
                                                        let scheduledEndTime = shortenTime(scheduledPatients[i].endTime);
                                                        let scheduledStartIndex = _.findIndex(timeOptions, { value: scheduledStartTime });
                                                        let scheduledEndIndex = _.findIndex(timeOptions, { value: scheduledEndTime });
                                                        // if(scheduledStartIndex !== defaultStartIndex && scheduledEndIndex !== defaultEndIndex){
                                                        if (
                                                            timeRangeOverlaps(
                                                                selectedStartIndex,
                                                                selectedEndIndex,
                                                                scheduledStartIndex,
                                                                scheduledEndIndex
                                                            )
                                                        ) {
                                                            isOverlapping = true;
                                                        }
                                                        // }
                                                    }
                                                    if (isOverlapping) {
                                                        return "Schedule overlaps with existing schedules.";
                                                    }
                                                },
                                            },
                                            // checkIfOverlapping: (value) =>{
                                            //     let { startTime } = getValues();
                                            //     let timeOptions = generateTimeOptions("end")
                                            //     let selectedStartIndex = _.findIndex(timeOptions, { value: startTime.value });
                                            //     let selectedEndIndex = _.findIndex(timeOptions, { value: value.value });

                                            //     console.log(scheduledPatients)

                                            //     for (let i = 0; i < scheduledPatients.length; i++) {
                                            //         let startTime = shortenTime(scheduledPatients[i].startTime);
                                            //         let endTime = shortenTime(scheduledPatients[i].endTime);
                                            //         let scheduledStartIndex = _.findIndex(timeOptions, { value: startTime });
                                            //         let scheduledEndIndex = _.findIndex(timeOptions, { value: endTime });

                                            //         //Not include self in checking
                                            //         if(selectedStartIndex <= scheduledStartIndex && selectedEndIndex >= scheduledEndIndex){
                                            //             //Selected start or end time must not overlap existing schedules
                                            //             if(scheduledStartIndex > selectedStartIndex || scheduledEndIndex < selectedEndIndex){
                                            //                 return (
                                            //                     "Schedule overlaps with existing schedules."
                                            //                 )
                                            //                 //     overlapping = true
                                            //             // break
                                            //             }
                                            //         }
                                            //     }
                                            // }
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
    selectedSchedule: state.schedules.selectedSchedule,
    selectedSchedulePhysician: state.schedules.selectedSchedulePhysician,
    modal: state.modal,
});

// export default connect(mapStateToProps, { getAvailablePatients })(CreatePatientAppointment);
export default CreatePatientAppointment;
