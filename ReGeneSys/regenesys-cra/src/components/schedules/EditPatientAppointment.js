import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getAvailablePatients, editPatientAppointment} from "../../actions/schedules";
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
    // const [filteredTimeOptions, setFilteredTimeOptions] = useState([]);

    const dispatch = useDispatch();

    const selectedSchedule = props.selectedSchedule[0];
    const selectedAppointment = props.selectedAppointment;
    const scheduledPatients = props.scheduledPatients;
    var availablePatients = [];
    var limitStartTime = []
    var limitEndTime = []
    var defaultPatient = [];
    var defaultStartTime = [];
    var defaultEndTime = [];
    const scheduleStartTime = shortenTime(selectedSchedule.event.startTime);
    const scheduleEndTime = shortenTime(selectedSchedule.event.endTime);
    console.log(selectedAppointment.startTime)
    console.log(selectedAppointment.endTime)
    const selectedAppointmentStartTime = shortenTime(selectedAppointment.startTime);
    const selectedAppointmentEndTime = shortenTime(selectedAppointment.endTime);
    var filteredTimeOptions = [];
    

    useEffect(() => {
        getPatients();
        getDefaultTimes()
    }, []);

    useEffect(() => {
        getDefaultPatient()
    },[availablePatients])

    useEffect(() => {
        generatePatientOptions(props.availablePatients);
    }, []);



    const closeModal = () => {
        dispatch(hideModal());
    };

    const getDefaultPatient = () => {
        defaultPatient.push(_.find(availablePatients, ["value", selectedAppointment.patient.patientId]));
        console.log(defaultPatient)
    };

    const getPatients = () => {
        dispatch(getAvailablePatients(selectedSchedule.pk, selectedAppointment.patient.patientId));
    };

    //gets default start and end time of schedule
    const getDefaultTimes = () => {
        defaultStartTime.push(_.find(timeOptions, ["value", selectedAppointmentStartTime]));
        defaultEndTime.push(_.find(timeOptions, ["value", selectedAppointmentEndTime]));
    };

    //Gets patients available for scheduling
    const generatePatientOptions = () => {
        props.availablePatients.forEach((patient) => {
            availablePatients.push({ value: patient.patientId, label: patient.firstName + " " + patient.lastName });
        });
        return availablePatients;
    };

    //Gets start and end time of scheule
    const getTimeLimit = () => {
        // if (defaultStartTime.length < 1) {
            limitStartTime = _.find(timeOptions, ["value", scheduleStartTime]);
            limitEndTime = _.find(timeOptions, ["value", scheduleEndTime]);
        // }
    };

    const generateTimeOptions = (remark) => {
        getTimeLimit();
        let limitStartIndex = _.findIndex(timeOptions, limitStartTime);
        let limitEndIndex = _.findIndex(timeOptions, limitEndTime);
        filteredTimeOptions = _.cloneDeep(_.slice(timeOptions, [limitStartIndex], [limitEndIndex + 1]))
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
                // if (selectedAppointmentStartIndex !== index - 1 || selectedAppointmentEndIndex !== endIndex){
                if ((index <= selectedAppointmentStartIndex || index >= selectedAppointmentEndIndex)){
                    // if (index - 1 < scheduledEndIndex){
                        for (index; index < scheduledEndIndex; index++) {
                            // if (!(index >= selectedAppointmentStartIndex && index <= selectedAppointmentEndIndex)){
                                // if (remark === "end" && filteredTimeOptions[index-1]["isDisabled"] === true){
                                    filteredTimeOptions[index]["isDisabled"] = true;     
                                // }
                            // }
                        }
                    // }
                }
            }
            else{
                //OK 10-12
                if (selectedAppointmentStartIndex !== index || selectedAppointmentEndIndex !== scheduledEndIndex){
                    for (index; index < scheduledEndIndex; index++) {
                        // if (!(index >= selectedAppointmentStartIndex && index <= selectedAppointmentEndIndex)){
                            // if (remark === "end" && filteredTimeOptions[index-1]["isDisabled"] === true){
                                filteredTimeOptions[index]["isDisabled"] = true;     
                            // }
                        // }
                    }
                }
            }
            //PROBLEM: CANNOT STEP BACK END TIME
            
        }
        return filteredTimeOptions;
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
            patient: defaultPatient,
            schedule: "",
            physician: "",
            startTime: defaultStartTime,
            endTime: defaultEndTime,
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
                                                    let { endTime } = getValues();
                                                    if (Array.isArray(value) || Array.isArray(endTime)) {
                                                        value = getValueFromArrayOrObject(value);
                                                        endTime = getValueFromArrayOrObject(endTime);
                                                        return value < endTime || endTime.length === 0 || "Must be before end time";
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
                                                    let { startTime } = getValues();
                                                    if (Array.isArray(value) || Array.isArray(startTime)) {
                                                        value = getValueFromArrayOrObject(value);
                                                        startTime = getValueFromArrayOrObject(startTime);
                                                        return value > startTime || startTime.length === 0 || "Must be after start time";
                                                    }
                                                },
                                                checkIfOverlapping: (value) =>{
                                                    let { startTime } = getValues();
                                                    let timeOptions = generateTimeOptions("end")
                                                    let selectedStartIndex = _.findIndex(timeOptions, { value: startTime.value });
                                                    let selectedEndIndex = _.findIndex(timeOptions, { value: value.value });
 
                                                    for (let i = 0; i < scheduledPatients.length; i++) {
                                                        let startTime = shortenTime(scheduledPatients[i].startTime);
                                                        let endTime = shortenTime(scheduledPatients[i].endTime);
                                                        let scheduledStartIndex = _.findIndex(timeOptions, { value: startTime });
                                                        let scheduledEndIndex = _.findIndex(timeOptions, { value: endTime });
                                                        
                                                        //Not include self in checking
                                                        if(selectedStartIndex <= scheduledStartIndex && selectedEndIndex >= scheduledEndIndex){
                                                            //Selected start or end time must not overlap existing schedules
                                                            if(scheduledStartIndex > selectedStartIndex || scheduledEndIndex < selectedEndIndex){
                                                                return (
                                                                    "Schedule overlaps with existing schedules."
                                                                )
                                                                //     overlapping = true
                                                            // break
                                                            }                                                            
                                                        }
                                                    }

                                                    // if(overlapping){
                                                        
                                                    // }
                                                    //for (let index = selectedStartIndex; index < timeOptions.length; index++){
                                                    //     if(index >= selectedStartIndex && index <= selectedEndIndex && "isDisabled" in timeOptions[index]){
                                                    //         console.log("yes")
                                                    //         return ( 
                                                    //             "Schedule overlapping is not allowed"
                                                    //             );
                                                    //     }
                                                    //}                                                    
                                                }
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
