import React, {useState, useEffect} from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";


import { getPatient } from "../../actions/patients";
import { showModal, hideModal } from "../../actions/modal";


function ViewModal(props){
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

    console.log(props.patient)

    console.log(clinical.status)



    const closeModal = () => {
        dispatch(hideModal());
    };

    return(

    <div>
        <Modal isOpen={modal} toggle={toggle} size="xl">
            <ModalHeader toggle={toggle}>Patient: {patientId}</ModalHeader>
            <ModalBody>
            <p>Name: {firstName} {middleName} {lastName} {suffix}</p>
            <p>Sex: {sex}</p>
            <p>Birth Date: {birthDate}</p>
            <p>Birth Place: {birthPlace}</p>
            <p>Address: {streetAdd} {brgyAdd} {cityAdd} {region}</p>
            <p>{}</p>

             
            {/* <p>Statu: {status}</p>
            <p>Case Number: {caseNumber}</p>
            <p>Patient Type: {patientType}</p>
            <p>Referring Doctor: {referringDoctor}</p>
            <p>Referring Service: {referringService}</p>
            <p>Reason for Referral: {referralReason}</p> */}
            
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
    </div>);



}

const mapStateToProps = (state) => ({
    patient: state.patients.patient,
    patients: state.patients.patients,
    modal: state.modal,
});

export default connect(mapStateToProps, {
})(ViewModal);