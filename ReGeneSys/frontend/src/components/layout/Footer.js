import React, { Component, Fragment, useState, useEffect } from "react";

export function Footer() {
    return (
        <Fragment>
            {/* Footer */}
            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright © Your Website 2020</span>
                    </div>
                </div>
            </footer>
            {/* End of Footer */}
        </Fragment>
    );
}

export default Footer;
