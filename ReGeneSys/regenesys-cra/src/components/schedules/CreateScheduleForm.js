import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getSchedules, getAvailablePhysicians, createEventSchedule } from "../../actions/schedules";

import { TimePicker } from "antd";

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

function CreateScheduleForm(props) {
    const [page, setPage] = useState(() => pageInitial());
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPhysician, setSelectedPhysician] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getPhysicians(props.modal.modalProps);
    }, []);

    const closeModal = () => {
        dispatch(hideModal());
    };

    const getPhysicians = (date) => {
        dispatch(getAvailablePhysicians(format(date, "yyyy-MM-dd")));
        generateOptions(props.availablePhysicians);
    };

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
            const check = trigger(["physician"]);
            return check;
        }
    };

    const { register, errors, control, handleSubmit, trigger, getValues } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            date: "",
            location: "",
            eventType: "clinic",
            startTime: "",
            endTime: "",
            description: "",
            attendees: [],
            physician: "",
        },
    });

    const onSubmit = (data) => {
        const { name, location, startTime, endTime, description, physician } = data;

        const physicianCollection = [];

        physician.forEach((element) => {
            physicianCollection.push(element["value"]);
        });

        // const date = format(props.modal.modalProps, "yyyy-MM-dd");

        const date = props.modal.modalProps

        const event = {
            name,
            date: date,
            location,
            eventType: "clinic",
            startTime: new Date(format(props.modal.modalProps, "yyyy-MM-dd") + " " + startTime),
            endTime: new Date(format(props.modal.modalProps, "yyyy-MM-dd") + " " + endTime),
            description,
            attendees: physicianCollection,
        };

        const scheduleToCreate = {
            event,
            physician: physicianCollection,
        };

        // console.log(scheduleToCreate);

        dispatch(createEventSchedule(scheduleToCreate));
        // toggleAll();
    };

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="md" backdrop="static" id="haha" keyboard={false}>
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
                                <div id="ace" className="form-group col-6">
                                    <label>Start Time</label>
                                    {/* <Controller
                                        as={TimePicker}
                                        getPopupContainer={() => document.getElementById("haha")}
                                        className=""
                                        name="startTime"
                                        bordered={false}
                                        size="large"
                                        control={control}
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
                                    <input
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
                                    <input
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
                                        as={
                                            <Select
                                                components={makeAnimated()}
                                                onChange={setSelectedPhysician}
                                                className="basic-single"
                                                placeholder="Select Physician"
                                                options={generateOptions()}
                                                noOptionsMessage={() => "No available physicians"}
                                                isSearchable
                                                isClearable
                                                isMulti
                                                name="physician"
                                            />
                                        }
                                        name="physician"
                                        control={control}
                                        rules={{ required: true }}
                                    />
                                    {errors.physician?.type === "required" && <p className="text-danger mb-0">This is required</p>}
                                </div>
                            </div>
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
    selectedSchedule: state.schedules.schedules,
    modal: state.modal,
});

export default connect(mapStateToProps, { getAvailablePhysicians })(CreateScheduleForm);
