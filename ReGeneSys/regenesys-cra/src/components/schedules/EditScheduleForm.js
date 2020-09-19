import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { getAvailablePhysicians, editEventSchedule, getSchedules } from "../../actions/schedules";
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

function EditScheduleForm(props) {
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

    const selectedSchedule = props.selectedSchedule[0];

    const defaultPhysician = [];

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
        console.log(defaultPhysician);
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
            const check = trigger(["physicians"]);
            return check;
        }
    };

    const { register, errors, control, handleSubmit, trigger, getValues } = useForm({
        criteriaMode: "all",
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            name: selectedSchedule.event.name,
            date: selectedSchedule.event.date,
            location: selectedSchedule.event.location,
            eventType: "clinic",
            startTime: selectedSchedule.event.startTime,
            endTime: selectedSchedule.event.endTime,
            description: selectedSchedule.event.description,
            attendees: [],
            physician: 7,
        },
    });

    const onSubmit = (data) => {
        const { name, location, startTime, endTime, description, physicians } = data;

        const physicianCollection = [];

        physicians.forEach((element) => {
            physicianCollection.push(element["value"]);
        });

        console.log(selectedPhysician);

        const event = {
            name,
            date: format(props.modal.modalProps, "yyyy-MM-dd"),
            location,
            eventType: "clinic",
            startTime,
            endTime,
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
                                        ref={register({
                                            required: "This is required",
                                        })}
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
    selectedSchedule: state.schedules.schedules,
    modal: state.modal,
});

export default connect(mapStateToProps, { getAvailablePhysicians })(EditScheduleForm);
