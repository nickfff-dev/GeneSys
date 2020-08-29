import { combineReducers } from "redux";
import patients from "./patients";
import errors from "./errors";
import messages from "./messages";
import auth from "./auth";
import modal from "./modal";
import schedules from "./schedules";

export default combineReducers({
    patients,
    errors,
    messages,
    auth,
    modal,
    schedules,
});
