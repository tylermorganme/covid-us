import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Row, Col, Table } from 'react-bootstrap';
import { useMainContext } from '../providers/MainProvider'
import round from 'lodash/round'
import { formatAsPercent } from '../utils/helpers'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

const numberFormatter = (cell, row, rowIndex, formatExtraData) => {
    return cell ? cell.toLocaleString() : null
}

let columns = [
    // {
    //   dataField: "name",
    //   text:"Name",
    // },
    {
        dataField: "state",
        text: "State"
    },
    {
        dataField: "positive",
        text: "Positive",
        formatter: numberFormatter,
        classes: 'text-right'
    },
    {
        dataField: "negative",
        text: "Negative",
        formatter: numberFormatter,
        classes: 'text-right'
    },
    {
        dataField: 'pending',
        text: 'Pending',
        formatter: numberFormatter,
        classes: 'text-right'
    },
    {
        dataField: 'positiveRate',
        text: '% Positive',
        formatter: (cell, row, rowIndex, formatExtraData) => {
            return cell ? formatAsPercent(cell, 2) : null
        },
        classes: 'text-right'
    },
    // {
    //     dataField: "negativeScore",
    //     text: "Negative Score"
    // },
    // {
    //     dataField: "negativeRegularScore",
    //     text: "Negative Regular Score"
    // },
    // {
    //     dataField: "commercialScore",
    //     text: "Commercial Score"
    // },
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
        text: "Total Test Results",
        formatter: numberFormatter,
        classes: 'text-right'
    },
    {
        dataField: "hospitalized",
        text: "Hospitalized",
        formatter: numberFormatter,
        classes: 'text-right'
    },
    {
        dataField: "death",
        text: "Death",
        formatter: numberFormatter,
        classes: 'text-right'
    },
    {
        dataField: "population",
        text: "Population",
        formatter: (cell, row, rowIndex, formatExtraData) => {
            return numberFormatter(parseInt(cell))
        },
        classes: 'text-right'
    }
]

const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
}]

columns = columns.map(column => ({ ...column, headerClasses: 'sticky', sort: true }))

const DataTable = () => {
    const { activeDayStateData } = useMainContext()

    return (
        <Row className='mt-3'>
            <Col>
                <BootstrapTable
                    bootstrap4
                    keyField='name'
                    data={activeDayStateData}
                    columns={columns}
                    defaultSorted={defaultSorted}
                />
                <Table striped bordered responsive >
                </Table>
            </Col>
        </Row>
    )
}

export default DataTable