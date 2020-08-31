import React, { useMemo } from "react";
import { connect, useSelector } from "react-redux";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { columns, data, data2 } from "./DataSource";
import { format } from "date-fns";
import { split } from "lodash";
import { shortenTime } from "./CalendarSchedule";

function TableSchedule(props) {
    // const APIValue = useSelector((state) => state);
    // const state = useSelector((state) => state);

    // const patients = useSelector((state) => state.schedules.patients);
    // const data = useMemo(() => getPatientData(props.patients), [patients]);

    const data = useMemo(() => getPatientData(props.patients), [props.patients]);

    function getPatientData(patients) {
        var allData = [];
        patients.forEach((element) => {
            var row = {
                col1: shortenTime(element.timeStart) + " - " + shortenTime(element.timeEnd),
                col2: element.patient.patientId,
                col3: element.patient.clinical.patientType,
                col4: element.status,
                col5: (
                    <div>
                        <button>edit</button>
                        <button>delete</button>
                    </div>
                ),
            };
            allData.push(row);
        });
        return allData;
    }

    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, page, prepareRow } = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize: 10,
                pageIndex: 0,
                globalFilter: "",
            },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    let tableComponent;

    if (props.isLoadingPatients === true) {
        tableComponent = <h1>Loading</h1>;
    } else {
        if (data.length === 0) {
            tableComponent = (
                <div className="row h-75">
                    <div className="col-12 my-auto">
                        <h3 className="text-center">No Patients Scheduled</h3>
                    </div>
                </div>
            );
        } else {
            tableComponent = (
                <table className="table table-striped table-responsive-md" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        {footerGroups.map((group) => (
                            <tr {...group.getFooterGroupProps()}>
                                {group.headers.map((column) => (
                                    <td {...column.getFooterProps()}>{column.Footer && column.render("Footer")}</td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            );
        }
    }

    return <div className="col-12 rounded h-100">{tableComponent}</div>;
}

const mapStateToProps = (state) => ({
    patients: state.schedules.patients,
    isLoadingPatients: state.schedules.isLoadingPatients,
    modal: state.modal,
});

export default connect(mapStateToProps, {})(TableSchedule);
