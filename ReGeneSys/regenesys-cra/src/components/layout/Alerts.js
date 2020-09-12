import React, { Component, Fragment } from "react";
import { withAlert } from "react-alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
    };

    componentDidUpdate(prevProps) {
        const { error, alert, message } = this.props;
        if (error !== prevProps.error) {
            if (error.msg.FirstName) alert.error(`First Name: ${error.msg.FirstName.join()}`);
            if (error.msg.LastName) alert.error(`Last Name: ${error.msg.LastName.join()}`);
            if (error.msg.MiddleName) alert.error(`Middle Name: ${error.msg.MiddleName.join()}`);
            if (error.msg.DOB) alert.error(`Date of Birth: ${error.msg.DOB.join()}`);
            if (error.msg.Gender) alert.error(`Gender: ${error.msg.Gender.join()}`);
            if (error.msg.StreetAdd) alert.error(`Street Address: ${error.msg.StreetAdd.join()}`);
            if (error.msg.BrgyAdd) alert.error(`Barangay Address: ${error.msg.BrgyAdd.join()}`);
            if (error.msg.CityAdd) alert.error(`City Address: ${error.msg.CityAdd.join()}`);
            if (error.msg.Region) alert.error(`Region: ${error.msg.Region.join()}`);
            if (error.msg.ContactPerson) alert.error(`Contact Person: ${error.msg.ContactPerson.join()}`);
            if (error.msg.ContactNumber) alert.error(`Contact Number: ${error.msg.ContactNumber.join()}`);
            if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
            if (error.msg.username) alert.error(error.msg.username.join());
        }

        if (message !== prevProps.message) {
            if (message.deletePatient) alert.success(message.deletePatient);
            if (message.addPatient) alert.success(message.addPatient);
            if (message.editPatient) alert.success(message.editPatient);
            if (message.passwordsNotMatch) alert.error(message.passwordsNotMatch);
            if (message.editPatient) alert.success(message.editPatient);
            if (message.addSchedule) alert.success(message.addSchedule);
            if (message.editSchedule) alert.success(message.editSchedule);
            if (message.deleteSchedule) alert.success(message.deleteSchedule);
        }
    }

    render() {
        return <Fragment />;
    }
}

const mapStateToProps = (state) => ({
    error: state.errors,
    message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
