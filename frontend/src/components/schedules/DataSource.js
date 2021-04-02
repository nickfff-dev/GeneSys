import React, { useMemo } from "react";

export const columns = [
    {
        Header: "Time",
        accessor: "col1", // accessor is the "key" in the data
    },
    {
        Header: "Patient",
        accessor: "col2",
    },
    {
        Header: "Clinic Type",
        accessor: "col3",
    },
    {
        Header: "Status",
        accessor: "col4",
    },
    {
        Header: "",
        accessor: "col5",
    },
];
const chance = [
    {
        col1: "0800 - 0900",
        col2: "CLNGN-123456789",
        col3: "Metabalic",
        col4: "Active",
        col5: (
            <div>
                <button>edit</button>
                <button>delete</button>
            </div>
        ),
    },
    {
        col1: "0900 - 1000",
        col2: "CLNGN-987654321",
        col3: "Dymorphologic",
        col4: "Active",
        col5: (
            <div>
                <button>edit</button>
                <button>delete</button>
            </div>
        ),
    },
];

// export const data = [];
// data.push(chance);

// export const data = [

// {
//     col1: "0800 - 0900",
//     col2: "CLNGN-123456789",
//     col3: "Metabalic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "0900 - 1000",
//     col2: "CLNGN-987654321",
//     col3: "Dymorphologic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1000 - 1100",
//     col2: "CLNGN-951753852",
//     col3: "Pre-Natal",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1100 - 1200",
//     col2: "CLNGN-753951654",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1200 - 1300",
//     col2: "CLNGN-147258396",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1300 - 1400",
//     col2: "CLNGN-369258147",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1400 - 1500",
//     col2: "CLNGN-748526391",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1500 - 1600",
//     col2: "CLNGN-852357951",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1600 - 1800",
//     col2: "CLNGN-748526391",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1800 - 1900",
//     col2: "CLNGN-852357951",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "1900 - 2000",
//     col2: "CLNGN-748526391",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "2000 - 2100",
//     col2: "CLNGN-852357951",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "2100 - 2200",
//     col2: "CLNGN-748526391",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// {
//     col1: "2200 - 2300",
//     col2: "CLNGN-852357951",
//     col3: "Metabolic",
//     col4: "Active",
//     col5: (
//         <div>
//             <button>edit</button>
//             <button>delete</button>
//         </div>
//     ),
// },
// ];

const mapStateToProps = (state) => ({
    patients: state.schedules.patients,
    isLoadingPatients: state.schedules.isLoadingPatients,
    modal: state.modal,
});
