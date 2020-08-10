import React, { Fragment, useState } from "react"
import { connect } from "react-redux";
import { useTable } from 'react-table'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../App.css'


function Schedules(props){
    
    const [value, setValue] = useState(new Date());

    function onChange(nextValue) {
        setValue(nextValue);
      }

      const data = React.useMemo(
        () => [
          {
            col1: 'Hello',
            col2: 'World',
          },
          {
            col1: 'react-table',
            col2: 'rocks',
          },
          {
            col1: 'whatever',
            col2: 'you want',
          },
        ],
        []
      )
    
      const columns = React.useMemo(
        () => [
          {
            Header: 'Time',
            accessor: 'col1', // accessor is the "key" in the data
          },
          {
            Header: 'Column 2',
            accessor: 'col2',
          },
        ],
        []
      )
    
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns, data })

    return(
        <Fragment>
            
            <div className="mb-3">
                <h2>Patient Scheduling</h2>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-12">
                <div className="calendar-box p-2 mb-2" style={{background:"cyan"}}>
                  <Calendar calendarType="US" className={["rc-override","mr-auto", "ml-auto"]} onChange={onChange} value={value} />
                </div>
                <div className="schedule-box p-2 mb-2" style={{height:"30vh", background:"cyan"}}>
                  <h6 className="h-4">Schedules for <i>DATE</i></h6>
                </div>
                <div className="text-center button-group mb-2 clearfix" style={{background:"cyan"}}>
                        <div className="">
                          <button className="btn btn-primary float-left" data-toggle="modal" data-target="#addAppointmentModal" onClick="">
                              Add Schedule
                          </button>
                          <button className="btn btn-primary float-right" data-toggle="modal" data-target="#addAppointmentModal" onClick="">
                              Add Appointment
                          </button>
                        </div>
                </div>
              </div>

              <div className="col-lg-8 col-md -12">
              <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
                  <thead>
                      {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map(column => (
                          <th
                              {...column.getHeaderProps()}
                              style={{
                              borderBottom: 'solid 3px red',
                              background: 'aliceblue',
                              color: 'black',
                              fontWeight: 'bold',
                              }}
                          >
                              {column.render('Header')}
                          </th>
                          ))}
                      </tr>
                      ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                      {rows.map(row => {
                      prepareRow(row)
                      return (
                          <tr {...row.getRowProps()}>
                          {row.cells.map(cell => {
                              return (
                              <td
                                  {...cell.getCellProps()}
                                  style={{
                                  padding: '10px',
                                  border: 'solid 1px gray',
                                  background: 'papayawhip',
                                  }}
                              >
                                  {cell.render('Cell')}
                              </td>
                              )
                          })}
                          </tr>
                      )
                      })}
                  </tbody>
              </table>
          </div>
          </div>
        </Fragment>
    )
} 

const mapStateToProps = (state) => ({
    
});

export default connect(mapStateToProps, {

})(Schedules);