import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Row, Col, Table } from 'react-bootstrap';
import { useMainContext } from '../providers/MainProvider'

let columns = [
    // {
    //   dataField: "name",
    //   text:"Name",
    // },
    {
        dataField: "state",
        text: "State",
        sort: true
    },
    {
        dataField: "positive",
        text: "Positive"
    },
    {
        dataField: "negative",
        text: "Negative"
    },
    {
        dataField: "negativeScore",
        text: "Negative Score"
    },
    {
        dataField: "negativeRegularScore",
        text: "Negative Regular Score"
    },
    {
        dataField: "commercialScore",
        text: "Commercial Score"
    },
    // { 
    //   dataField: "score",
    //   text: "Score"
    // },
    // { 
    //   dataField: "grade",
    //   text: "Grade"
    // },
    {
        dataField: "totalTestResults",
        text: "Total Test Results"
    },
    {
        dataField: "hospitalized",
        text: "Hospitalized"
    },
    {
        dataField: "death",
        text: "Death"
    },
    {
        dataField: "population",
        text: "Population"
    },
    {
        dataField: "density",
        text: "Density"
    },
    {
        dataField: "dateModified",
        text: "Date Modified"
    },
    {
        dataField: "dateChecked",
        text: "Date Checked"
    },
    {
        dataField: 'totalResultsPlusPending',
        text: 'Total Results Plus Pending'
    },
    {
        dataField: 'pending',
        text: 'Pending'
    }

]

columns = columns.map(column => ({ ...column, headerClasses: 'sticky' }))

const DataTable = () => {
    const { activeDayStateData  } = useMainContext()

    return (
        <Row style={{ marginTop: '15px' }}>
            <Col>
                <BootstrapTable keyField='name' data={activeDayStateData} columns={columns} />
                <Table striped bordered responsive >
                </Table>
            </Col>
        </Row>
    )
}

export default DataTable