import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import { showModal, hideModal } from "../../actions/modal";

export class ViewModal extends Component {
    static propTypes = {
        patients: PropTypes.array.isRequired,
        showModal: PropTypes.func.isRequired,
        hideModal: PropTypes.func.isRequired,
        modal: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const { modalType, modalProps } = this.props.modal;
        const modalData = _.find(this.props.patients, {
            PatientID: modalProps,
        });

        const {
            PatientID,
            FirstName,
            LastName,
            MiddleName,
            Suffix,
            DOB,
            Gender,
            StreetAdd,
            BrgyAdd,
            CityAdd,
            Region,
            ContactPerson,
            ContactNumber,
        } = modalData;

        this.state = {
            PatientID: PatientID,
            FirstName: FirstName,
            LastName: LastName,
            MiddleName: MiddleName,
            Suffix: Suffix,
            DOB: DOB,
            Gender: Gender,
            StreetAdd: StreetAdd,
            BrgyAdd: BrgyAdd,
            CityAdd: CityAdd,
            Region: Region,
            ContactPerson: ContactPerson,
            ContactNumber: ContactNumber,
            ModalPage: 1,
        };
    }

    state = {
        PatientID: "",
        FirstName: "",
        LastName: "",
        MiddleName: "",
        Suffix: "",
        DOB: "",
        Gender: "",
        StreetAdd: "",
        BrgyAdd: "",
        CityAdd: "",
        Region: "",
        ContactPerson: "",
        ContactNumber: "",
        ModalPage: 1,
    };

    nextPage = () => {
        if (this.state.ModalPage < 3) {
            this.setState({ ModalPage: this.state.ModalPage + 1 });
        }
        console.log(this.state.ModalPage);
    };

    previousPage = () => {
        if (this.state.ModalPage > 1) {
            this.setState({ ModalPage: this.state.ModalPage - 1 });
        }
        console.log(this.state.ModalPage);
    };

    render() {
        return (
            <Fragment>
                <div className="modal" id="viewModal">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {this.state.PatientID} {this.state.ModalPage}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.hideModal.bind()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            {this.state.ModalPage === 1 && (
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>First Name</label>
                                            <span>{this.state.FirstName}</span>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Last Name</label>
                                            <span>{this.state.LastName}</span>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Middle Name</label>
                                            <span>{this.state.MiddleName}</span>
                                        </div>
                                        <div className="col-md-3">
                                            <label>Suffix</label>
                                            <span>{this.state.Suffix}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {this.state.ModalPage === 2 && (
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label>DOB</label>
                                            <span>{this.state.DOB}</span>
                                        </div>
                                        <div className="col-md-4">
                                            <label>Age</label>
                                            <span>{this.state.DOB}</span>
                                        </div>
                                        <div className="col-md-4">
                                            <label>Gender</label>
                                            <span>{this.state.Gender}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {this.state.ModalPage === 3 && (
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Contact Person</label>
                                            <span>{this.state.ContactPerson}</span>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Contact Number</label>
                                            <span>{this.state.ContactNumber}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.previousPage}>
                                    Previous Page
                                </button>
                                <button type="button" className="btn btn-primary" onClick={this.nextPage}>
                                    Next Page
                                </button>

                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.hideModal.bind()}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    patients: state.patients.patients,
    modal: state.modal,
});

export default connect(mapStateToProps, { showModal, hideModal })(ViewModal);
