import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { parseISO, differenceInYears, addYears, differenceInMonths, addMonths, differenceInDays } from "date-fns";

import { showModal, hideModal } from "../../reducers/modalSlice";
import { Fragment } from "react";

function ViewModal(props) {
    const [modal, setModal] = useState(props.toggleModal);
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(true);

    const dispatch = useDispatch();

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
    } = props.patient;

    const closeModal = () => {
        dispatch(hideModal());
    };

    var today = new Date();
    var fullbirthDate = new Date(birthDate);

    var age_now = today.getFullYear() - fullbirthDate.getFullYear();

    console.log(birthDate);
    console.log();
    console.log(age_now);

    const calculateAge = (dob) => {
        const result = [];
        const now = new Date();
        let age = parseISO(dob);

        const years = differenceInYears(now, age);
        if (years > 0) {
            result.push(`${years} years`);
            age = addYears(age, years);
        }

        const months = differenceInMonths(now, age);
        if (months > 0) {
            result.push(`${months} months`);
            age = addMonths(age, months);
        }

        const days = differenceInDays(now, age);
        if (days > 0) {
            result.push(`${days} days`);
        }

        return result.join(", ");
    };

    if (props.patient.length === 0) {
        return <h1>loading</h1>;
    }
    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="xl" backdrop="static" keyboard={false}>
                <ModalHeader toggle={toggle}>
                    [{clinical.status}]Patient: {patientId}{" "}
                </ModalHeader>
                <ModalBody>
                    <div class="demographic-box p-2 mb-2">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <strong>Demographic Data</strong>
                            </div>

                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Name: </strong>
                                    {firstName} {middleName} {lastName} {suffix}
                                </p>
                            </div>

                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Sex: </strong>
                                    {sex}
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Birth Date: </strong>
                                    {birthDate} ({calculateAge(birthDate)})
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Birth Place: </strong>
                                    {birthPlace}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p>
                                    <strong>Address: </strong>
                                    {streetAdd} {brgyAdd} {cityAdd}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p>
                                    <strong>Region: </strong>
                                    {region}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="diagnostic-box p-2 mb-2">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <strong>Diagnostic Data</strong>
                            </div>

                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Case Number: </strong>
                                    {clinical.caseNumber}
                                </p>
                            </div>

                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Patient Type: </strong>
                                    {clinical.patientType}
                                </p>
                            </div>

                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Referring Doctor: </strong>
                                    {clinical.referringDoctor}
                                </p>
                            </div>

                            <div className="col-md-3 col-sm-6">
                                <p>
                                    <strong>Referring Service: </strong>
                                    {clinical.referringService}
                                </p>
                            </div>

                            <div className="col-md-12">
                                <p>
                                    <strong>Reason for Referral: </strong>
                                    {clinical.referralReason}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-box p-2 mb-2">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <strong>Contact Information</strong>
                            </div>

                            {contact.altContactName.length > 0 && (
                                <Fragment>
                                    <div className="col-md-6 col-sm-12">
                                        <p>
                                            <strong>Alternative Contact Name: </strong>
                                            {contact.altContactName}
                                        </p>
                                    </div>

                                    <div className="col-md-6 col-sm-12">
                                        <p>
                                            <strong>Alternative Contact Number: </strong>
                                            {contact.altContactNumber}
                                        </p>
                                    </div>

                                    <div className="col-12">
                                        <p>
                                            <strong>Alternative Contact Address: </strong>
                                            {contact.altAddress}
                                        </p>
                                    </div>
                                </Fragment>
                            )}
                            {contact.fathersName.length > 0 && (
                                <Fragment>
                                    <div className="col-md-6 col-sm-12">
                                        <p>
                                            <strong>Father's Name: </strong>
                                            {contact.fathersName}
                                        </p>
                                    </div>

                                    <div className="col-md-6 col-sm-12">
                                        <p>
                                            <strong>Father's Contact Number: </strong>
                                            {contact.fContactNumber}
                                        </p>
                                    </div>

                                    <div className="col-12">
                                        <p>
                                            <strong>Father's Address: </strong>
                                            {contact.fAddress}
                                        </p>
                                    </div>
                                </Fragment>
                            )}
                            {contact.mothersName.length > 0 && (
                                <Fragment>
                                    <div className="col-md-6 col-sm-12">
                                        <p>
                                            <strong>Mother's Name: </strong>
                                            {contact.mothersName}
                                        </p>
                                    </div>

                                    <div className="col-md-6 col-sm-12">
                                        <p>
                                            <strong>Mother's Contact Number: </strong>
                                            {contact.mContactNumber}
                                        </p>
                                    </div>

                                    <div className="col-12">
                                        <p>
                                            <strong>Mother's Address: </strong>
                                            {contact.mAddress}
                                        </p>
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </div>
                    <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined}>
                        <ModalHeader>Save Changes</ModalHeader>
                        <ModalBody>Are you sure you want to save the changes you made?</ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick="">
                                Yes
                            </Button>
                            <Button color="secondary" onClick={toggleNested}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={toggle}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => ({
    patient: state.patients.patient,
    patients: state.patients.patients,
    modal: state.modal,
});

export default connect(mapStateToProps, {})(ViewModal);
