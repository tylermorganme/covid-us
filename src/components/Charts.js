import React from 'react'
import TestChart from './charts/TestChart'
import TestCoverageChart from './charts/TestCoverageChart'
import RateChart from './charts/RateChart'
import { Row, Col, Container } from 'react-bootstrap'

const Charts = () => {
    const charts = [TestChart, RateChart, TestCoverageChart]

    return (
        <Container>
            {
                charts.map((Chart, index) => {
                    return (
                        <Row key={index}>
                            <Col>
                                <Chart />
                            </Col>
                        </Row>
                    )
                })
            }
        </Container>
    )
}

export default Charts