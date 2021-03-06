import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import {} from "../../actions/schedules";
import { getAvailablePhysicians, editEventSchedule } from "../../reducers/schedulesSlice";
import { format } from "date-fns";

import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { getValueFromArrayOrObject, shortenTime } from "./CalendarSchedule";

import _ from "lodash";

import { hideModal } from "../../reducers/modalSlice";
import { array } from "prop-types";

function pageInitial() {
    return 1;
}

function EditScheduleForm(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPhysician, setSelectedPhysician] = useState([]);
    const [inputTimeResetCounter, setInputTimeResetCounter] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getPhysicians(props.modal.modalProps);
    }, []);

    useEffect(() => {
        getDefaultTimes();
    });

    const selectedSchedule = props.selectedSchedule[0];

    const defaultPhysician = [];
    const defaultStartTime = [];
    const defaultEndTime = [];

    const closeModal = () => {
        dispatch(hideModal());
    };

    const getPhysicians = () => {
        dispatch(getAvailablePhysicians(""));
        generateOptions(props.availablePhysicians);
        for (var i = 0; i < selectedSchedule.physician.length; i++) {
            defaultPhysician.push({
                value: selectedSchedule.physician[i].id,
                label: selectedSchedule.physician[i].firstName + " " + selectedSchedule.physician[i].lastName,
            });
        }
    };

    const getDefaultTimes = () => {
        const timeOptions = generateTimeOptions();
        const startTime = shortenTime(selectedSchedule.event.startTime);
        const endTime = shortenTime(selectedSchedule.event.endTime);

        if (defaultStartTime.length < 1) {
            defaultStartTime.push(_.find(timeOptions, ["value", startTime]));
            defaultEndTime.push(_.find(timeOptions, ["value", endTime]));
        }
        // console.log(startTime.toString());
        // console.log(_.find(timeOptions, ["value", "05:00"]));
        // console.log(_.find(options, ["value", "05:00"]));
        // console.log(defaultStartTime);
        // console.log(defaultEndTime);
        // console.log("2");
    };

    const generateTimeOptions = () => {
        const timeOptions = [];
        const halfHours = ["00", "30"];
        for (var i = 0; i < 24; i++) {
            for (var j = 0; j < halfHours.length; j++) {
                if (i < 12) {
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

                // if (shortenTime(selectedSchedule.event.startTime) === hourValue && defaultStartTime < 1) {
                //     defaultStartTime = { value: hourValue, label: hourLabel };
                // }
                // if (shortenTime(selectedSchedule.event.endTime) === hourValue && defaultEndTime < 1) {
                //     defaultEndTime = { value: hourValue, label: hourLabel };
                // }
            }
        }
        return timeOptions;
    };

    // console.log("START");
    // console.log(defaultStartTime);
    // console.log("END");
    // console.log(defaultEndTime);

    const generateOptions = () => {
        const availablePhysicians = [];
        props.availablePhysicians.forEach((physician) => {
            availablePhysicians.push({ value: physician.id, label: physician.firstName + " " + physician.lastName });
        });
        return availablePhysicians;
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
            const check = trigger(["name", "location", "description", "startTime", "endTime"]);
            return check;
        } else {
            const check = trigger(["physicians"]);
            return check;
        }
    };

    const resetOppositeTime = (inputChanged) => {
        if (inputTimeResetCounter === false) {
            var defaultValue = [];
            if (inputChanged === "start") {
                const { endTime } = getValues();
                reset({
                    name: selectedSchedule.event.name,
                    date: selectedSchedule.event.date,
                    location: selectedSchedule.event.location,
                    eventType: "clinic",
                    endTime: endTime,
                    description: selectedSchedule.event.description,
                    attendees: [],
                    physician: "",
                });
            } else {
                const { startTime } = getValues();
                defaultValue.push(startTime);
                reset({
                    name: selectedSchedule.event.name,
                    date: selectedSchedule.event.date,
                    location: selectedSchedule.event.location,
                    eventType: "clinic",
                    startTime: startTime,
                    description: selectedSchedule.event.description,
                    attendees: [],
                    physician: "",
                });
            }
            setInputTimeResetCounter();
        }
    };

    const { register, errors, control, handleSubmit, trigger, getValues, reset } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: selectedSchedule.event.name,
            date: selectedSchedule.event.date,
            location: selectedSchedule.event.location,
            eventType: "clinic",
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            description: selectedSchedule.event.description,
            attendees: [],
            physician: "",
        },
    });

    const onSubmit = (data) => {
        const { name, location, startTime, endTime, description, physicians } = data;

        const physicianCollection = [];

        physicians.forEach((element) => {
            physicianCollection.push(element["value"]);
        });

        //date is in UTC due to react-calendar
        const date = props.modal.modalProps;

        const event = {
            name,
            date: date,
            location,
            eventType: "clinic",
            startTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(startTime)),
            endTime: new Date(format(date, "yyyy-MM-dd") + " " + getValueFromArrayOrObject(endTime)),
            description,
            attendees: physicianCollection,
        };

        const scheduleToEdit = {
            event,
            physician: physicianCollection,
        };

        dispatch(editEventSchedule(selectedSchedule.pk, scheduleToEdit));
        console.log(event);
        toggleAll();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="md" backdrop="static" keyboard={false}>
                <ModalHeader toggle={toggle}>
                    Create Schedule for <i>Date</i>
                </ModalHeader>
                <ModalBody>
                    <form id="create-form" onSubmit={handleSubmit(onSubmit)}>
                        <div id="page-one" className={page === 1 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-12">
                                    <label>Schedule Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        ref={register({
                                            required: "This input is required.",
                                            minLength: {
                                                value: 2,
                                                message: "This input is too short.",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: "This input is too long.",
                                            },
                                        })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="name"
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
                                <div className="form-group col-12">
                                    <label>Location</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="location"
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
                                        name="location"
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
                                    <label>Start Time</label>
                                    {/* <input
                                        className="form-control"
                                        type="time"
                                        step="1800"
                                        name="startTime"
                                        ref={register({
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    const { endTime } = getValues();
                                                    return value < endTime || endTime.length === 0 || "Must be before end time";
                                                },
                                            },
                                        })}
                                    /> */}
                                    <Controller
                                        // as={
                                        //     <Select
                                        //         // components={makeAnimated()}
                                        //         className="basic-single"
                                        //         placeholder="Select Start Time"
                                        //         options={generateTimeOptions("start")}
                                        //         // defaultValue={defaultStartTime}
                                        //         // noOptionsMessage={() => "No available physicians"}
                                        //         // isMulti
                                        //         // name="physician"
                                        //         name="startTime"
                                        //         onFocus={() => resetOppositeTime("start")}
                                        //         // onChange={() => resetEndTime()}
                                        //         // onClick={() => reset({ endTime: "bill" })}
                                        //     />
                                        // }
                                        as={Select}
                                        // components={makeAnimated()}
                                        className="basic-single"
                                        placeholder="Select Start Time"
                                        options={generateTimeOptions("start")}
                                        // defaultValue={defaultStartTime}
                                        // noOptionsMessage={() => "No available physicians"}
                                        // isMulti
                                        // name="physician"
                                        onFocus={() => resetOppositeTime("start")}
                                        // onChange={() => resetEndTime()}
                                        // onClick={() => reset({ endTime: "bill" })}

                                        name="startTime"
                                        control={control}
                                        rules={{
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    let { endTime } = getValues();
                                                    if (endTime) {
                                                        //Default values are in array form. This is to fix value checking
                                                        if (Array.isArray(value) || Array.isArray(endTime)) {
                                                            value = getValueFromArrayOrObject(value);
                                                            endTime = getValueFromArrayOrObject(endTime);

                                                            // if (Array.isArray(value)) {
                                                            //     value = value[0].value;
                                                            // } else if (typeof value === "object") {
                                                            // }

                                                            // if (Array.isArray(endTime)) {
                                                            //     endTime = endTime[0].value;
                                                            // }
                                                            // // else if() {

                                                            // // }

                                                            return value < endTime || endTime.length === 0 || "Must be before end time";
                                                        }
                                                        // return value.value < endTime.value || endTime.value.length === 0 || "Must be before end time";
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
                                    {/* <input
                                        className="form-control"
                                        type="time"
                                        name="endTime"
                                        ref={register({
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    const { startTime } = getValues();
                                                    return value > startTime || startTime.length === 0 || "Must be after start time";
                                                },
                                            },
                                        })}
                                    /> */}
                                    <Controller
                                        // as={
                                        //     <Select
                                        //         // components={makeAnimated()}
                                        //         // onChange={setSelectedPhysician}
                                        //         className="basic-single"
                                        //         placeholder="Select End Time"
                                        //         options={generateTimeOptions()}
                                        //         onFocus={() => resetOppositeTime("end")}
                                        //         // defaultValue={defaultEndTime}
                                        //         // noOptionsMessage={() => "No available physicians"}
                                        //         // isMulti
                                        //         // name="physician"
                                        //     />
                                        // }
                                        as={Select}
                                        // components={makeAnimated()}
                                        // onChange={setSelectedPhysician}
                                        className="basic-single"
                                        placeholder="Select End Time"
                                        options={generateTimeOptions()}
                                        onFocus={() => resetOppositeTime("end")}
                                        // defaultValue={defaultEndTime}
                                        // noOptionsMessage={() => "No available physicians"}
                                        // isMulti
                                        // name="physician"

                                        name="endTime"
                                        control={control}
                                        rules={{
                                            required: "This is required",
                                            validate: {
                                                lesserThanEndTime: (value) => {
                                                    let { startTime } = getValues();
                                                    if (startTime && value != "") {
                                                        if (Array.isArray(value) || Array.isArray(startTime)) {
                                                            // if (Array.isArray(value)) {
                                                            //     console.log("value is Array");
                                                            //     console.log(value);
                                                            //     value = _.first(value).value;
                                                            //     console.log(value);
                                                            // } else if (typeof value === "object") {
                                                            //     console.log("value is Object");
                                                            //     console.log(value);
                                                            //     value = value.value;
                                                            //     console.log(value);
                                                            // }
                                                            value = getValueFromArrayOrObject(value);
                                                            startTime = getValueFromArrayOrObject(startTime);

                                                            // if (Array.isArray(startTime)) {
                                                            //     console.log("startTime is array");
                                                            //     console.log(startTime);
                                                            //     startTime = _.first(startTime).value;
                                                            //     // console.log(startTime);
                                                            // } else if (typeof startTime === "object") {
                                                            //     console.log("startTime is Object");
                                                            //     console.log(startTime);
                                                            //     startTime = startTime.value;
                                                            //     console.log(startTime);
                                                            // }
                                                            // value = _.first(value).value;
                                                            // startTime = _.first(startTime).value;

                                                            // console.log("inside if array");
                                                            // console.log(value);
                                                            // console.log(startTime);
                                                            // console.log(value < startTime);
                                                            // console.log(startTime.length === 0);

                                                            return value > startTime || startTime.length === 0 || "Must be after start time";
                                                        }
                                                        // console.log("inside");
                                                        // console.log(value);
                                                        // console.log(startTime);
                                                        // console.log(value < startTime);
                                                        // console.log(startTime.length === 0);
                                                        return (
                                                            value.value > startTime.value ||
                                                            startTime.value.length === 0 ||
                                                            "Must be after start time"
                                                        );

                                                        // if (Array.isArray(value)) {
                                                        //     value = value[0].value;
                                                        // }
                                                        // if (Array.isArray(startTime)) {
                                                        //     startTime = startTime[0].value;
                                                        // }
                                                        // console.log("end");
                                                        // console.log(value);
                                                        // console.log(startTime);
                                                        // console.log(value < startTime);
                                                        // console.log(startTime.length === 0);
                                                        // return value > startTime || startTime.length === 0 || "Must be after start time";
                                                    }
                                                    // else if (startTime[0].length != 0){
                                                    //     return (
                                                    //         value.value > startTime.value ||
                                                    //         startTime.value.length === 0 ||
                                                    //         "Must be after start time"
                                                    //     );
                                                    // }
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
                            <div className="form-row">
                                <div className="form-group col-12">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        name="description"
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
                                        name="description"
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
                        <div id="page-two" className={page === 2 ? "" : "d-none"}>
                            <div className="form-row">
                                <div className="form-group col-12">
                                    <label>Assign Physician/s</label>
                                    <Controller
                                        as={Select}
                                        options={generateOptions()}
                                        defaultValue={defaultPhysician}
                                        name="physicians"
                                        noOptionsMessage={() => "No available physicians"}
                                        placeholder="Select Physician"
                                        onChange={setSelectedPhysician}
                                        className="basic-single"
                                        isMulti
                                        isClearable
                                        control={control}
                                        rules={{
                                            required: "This is required",
                                        }}
                                    />
                                    {/* <Controller
                                        as={
                                            // <Select
                                            //     defaultValue={[colourOptions[1]]}
                                            //     isMulti
                                            //     options={colourOptions}
                                            //     components={makeAnimated()}

                                            //     
                                            //     // options={generateOptions()}
                                            //     
                                            //     isClearable
                                            //     name="physician"
                                            // />
                                        }
                                        defaultValue={[colourOptions[1]]}
                                        name="physician"
                                        control={control}
                                        rules={{ required: true }}
                                    /> */}
                                    {errors.physicians?.type === "required" && <p className="text-danger mb-0">This is required</p>}
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
                    {page < 2 && (
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
                    {page === 2 && (
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
                    )}
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={toggle}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => ({
    availablePhysicians: state.schedules.availablePhysicians,
    selectedSchedule: state.schedules.selectedSchedule,
    modal: state.modal,
});

export default connect(mapStateToProps, { getAvailablePhysicians })(EditScheduleForm);
