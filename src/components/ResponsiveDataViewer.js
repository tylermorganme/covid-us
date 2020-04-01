import React from 'react'
import DataAccordion from './DataAccordion'
import DataTable from './DataTable'
import { useWindowWidth } from '@react-hook/window-size/throttled'
import { Container } from 'react-bootstrap'

const ResponsiveDataViewer = () => {
    const windowWidth = useWindowWidth()
    if (windowWidth > 1000) return <DataTable />
    return (
        <Container fluid={windowWidth > 1000} id='tableContainer'>
            <h3>Click a state below to see the raw data for that state.</h3>
            <DataAccordion />
        </Container>
    )
}

export default ResponsiveDataViewer