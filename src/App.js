import React, { useEffect, useState } from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import _ from 'lodash'
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useMainContext } from './providers/MainProvider'
import { standardColors, highlightColors } from './constants'


const TestChart = ({ data }) => {
  const { setActiveState } = useMainContext()
  const onClick = (data) => {
    setActiveState(data.state)
  }

  const { activeState } = useMainContext()

  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="state" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar key="positive" onClick={onClick} dataKey="positive" stackId="a" fill={standardColors[0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  highlightColors[0] :
                  standardColors[0]

              }
            />
          ))}
        </Bar>
        <Bar key="negative" onClick={onClick} dataKey="negative" stackId="a" fill={standardColors[1]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  highlightColors[1] :
                  standardColors[1]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer >
  );

}

const RateChart = ({ data }) => {
  const { setActiveState } = useMainContext()
  const { activeState } = useMainContext()

  const onClick = (data) => {
    setActiveState(data.state)
  }


  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="state" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar key="positiveRate" onClick={onClick} dataKey="positiveRate" stackId="a" fill={standardColors[0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  highlightColors[0] :
                  standardColors[0]
              }
            />
          ))}
        </Bar>
        <Bar key="negativeRate" onClick={onClick} dataKey="negativeRate" stackId="a" fill={standardColors[1]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  highlightColors[1] :
                  standardColors[1]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

}

const TestCoverageChart = ({ data }) => {
  const { setActiveState } = useMainContext()
  const { activeState } = useMainContext()

  const onClick = (data) => {
    setActiveState(data.state)
  }

  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="state" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar onClick={onClick} dataKey="testCoverage" stackId="a" fill={standardColors[0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  highlightColors[0] :
                  standardColors[0]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

}

const App = () => {
  const { loading, error, stateData } = useMainContext()

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <Container>
      <Row>
        <Col>
          <TestChart
            data={_.sortBy(stateData, 'totalTestResults')}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <RateChart
            data={_.sortBy(stateData, 'positiveRate')}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <TestCoverageChart
            data={_.sortBy(stateData, 'testCoverage')}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>Positive</th>
                <th>Negative</th>
                <th>Negative Score</th>
                <th>Negative Regular Score</th>
                <th>Commercial Score</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Total Test Results</th>
                <th>Hospitalized</th>
                <th>Death</th>
                <th>Population</th>
                <th>Density</th>
                <th>Date Modified</th>
                <th>Date Checked</th>
              </tr>
            </thead>
            <tbody>
              {
                stateData.map((state) => {
                  return (
                    <tr key={state['state']}>
                      <td>{state['name']}</td>
                      <td>{state['state']}</td>
                      <td>{state['positive']}</td>
                      <td>{state['negative']}</td>
                      <td>{state['negativeScore']}</td>
                      <td>{state['negativeRegularScore']}</td>
                      <td>{state['commercialScore']}</td>
                      <td>{state['score']}</td>
                      <td>{state['grade']}</td>
                      <td>{state['totalTestResults']}</td>
                      <td>{state['hospitalized']}</td>
                      <td>{state['death']}</td>
                      <td>{state['population']}</td>
                      <td>{state['density']}</td>
                      <td>{state['dateModified']}</td>
                      <td>{state['dateChecked']}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
