import React, { Fragment } from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import "../../static/sb-admin2/css/sb-admin-2.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Patients from "../patients/Patients";
import Schedules from "../schedules/Schedules";
import PrivateRoute from "../common/PrivateRoute";
// import Login from "../accounts/Login";
// import Register from "../../components/accounts/Register";
// import HomeContainer from "./HomeContainer";
// import Dashboard from "../patients/Dashboard";

const routes = [
    {
        path: "/",
        exact: true,
        // sidebar: () => <div>home!</div>,
        main: () => <h2>Home</h2>,
    },
    {
        path: "/dashboard",
        // sidebar: () => <div>dashboard!</div>,
        main: () => <h1>Dashboard</h1>,
    },
    {
        path: "/patients",
        // sidebar: () => <div>patients!</div>,
        main: () => <Patients />,
    },
    {
        path: "/schedule",
        // sidebar: () => <div>patients!</div>,
        main: () => <Schedules />,
    },
];

export function Home() {
    let { path, url } = useRouteMatch();
    const NoMatch = ({ location }) => (
        <h3>
            No match for <code>{location.pathname}</code>
        </h3>
    );
    console.log(path);
    return (
        // <Switch>
        //     <PrivateRoute path="/" component={Dashboard} />
        //     <PrivateRoute path="/patients" component={Patients} />
        //     <PrivateRoute path="/dashboard" component={Dashboard} />
        //     <Route path="/login">
        //         <Login />
        //     </Route>
        //     <Route component={NoMatch} />
        // </Switch>
        // <HomeContainer>
        // <h1>a</h1>
        //     <Patients />
        // </HomeContainer>

        <Fragment>
            {/* Page Wrapper */}
            <div id="wrapper">
                <Sidebar />
                {/* Content Wrapper */}
                <div id="content-wrapper" className="d-flex flex-column">
                    {/* Main Content */}
                    <div id="content">
                        <Navbar />
                        {/* Begin Page Content */}
                        <div className="container-fluid">
                            {/* Page Heading */}
                            {/* <Switch> */}
                            <Fragment>
                                <Switch>
                                    {routes.map((route, index) => (
                                        // Render more <Route>s with the same paths as
                                        // above, but different components this time.
                                        <PrivateRoute key={index} path={route.path} exact={route.exact} children={<route.main />} />
                                    ))}
                                </Switch>
                            </Fragment>
                            {/* <Route exact path="/">
                                    <h1>home</h1>
                                </Route>
                                <Route path="/patients">
                                    <h1>patients</h1>
                                </Route>
                                <Route path="/dashboard">
                                    <h1>dashboard</h1>
                                </Route> */}
                            {/* </Switch> */}
                            {/* <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Patient Management</h1>
                                <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                    <i className="fas fa-download fa-sm text-white-50" /> Generate Report
                                </a>
                            </div> */}
                        </div>
                        {/* /.container-fluid */}
                    </div>
                    {/* End of Main Content */}
                    {/* Footer */}
                    <Footer />
                    {/* End of Footer */}
                </div>
                {/* End of Content Wrapper */}
            </div>
            {/* End of Page Wrapper */}
            {/* Scroll to Top Button*/}
            <a className="scroll-to-top rounded" href="#page-top">
                <FontAwesomeIcon icon={faAngleUp} className="" />
            </a>
            {/* Logout Modal*/}
            <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Ready to Leave?
                            </h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">
                                Cancel
                            </button>
                            <a className="btn btn-primary" href="login.html">
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bootstrap core JavaScript*/}
            {/* Core plugin JavaScript*/}
            {/* Custom scripts for all pages*/}
            {/* Page level plugins */}
            {/* Page level custom scripts */}
        </Fragment>
    );
}

export default Home;
