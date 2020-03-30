import React from 'react';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import _ from 'lodash'
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useMainContext } from './providers/MainProvider'
import { standardColors, highlightColors } from './constants'
import { useWindowWidth } from '@react-hook/window-size/throttled'

const CustomizedAxisTick = ({ x, y, payload }) => {
  const windowWidth = useWindowWidth()
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={4}
        dx={0}
        textAnchor="start"
        fill="#666"
        transform="rotate(90)"
        fontFamily="Courier New"
        fontSize="16px"
        // fontSize={`${Math.min(16, windowWidth/60)}px`}
        fontSizeAdjust={(windowWidth/1600).toString()}
      >
        {payload.value}
      </text>
    </g>
  );
}

const StackedBarChart = ({ data, seriesList, xTickFormatter, sortBy, title }) => {
  const { activeState, setActiveState } = useMainContext()
  const windowWidth = useWindowWidth()
  const onClick = (data) => {
    setActiveState(data.state)
  }

  const xDefaultTickFormatter = tick => (tick)

  const chartData = _.sortBy(data, sortBy)

  return (
    <ResponsiveContainer width="100%" height={Math.min(windowWidth/2, 600)}>
      <BarChart
        data={chartData}
        // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <Tooltip formatter={xTickFormatter ? xTickFormatter : xDefaultTickFormatter} />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="state"
          interval={ windowWidth > 890 ? 0 : 1 }
          tick={<CustomizedAxisTick />}
        />
        <YAxis tickFormatter={xTickFormatter ? xTickFormatter : xDefaultTickFormatter} />
        <Tooltip />
        <Legend />
        {seriesList.map((series, index) => (
            <Bar key={series['key']} onClick={onClick} dataKey={series['key']} stackId="a" fill={standardColors[index]} name={series['name']}>
              {chartData.map(entry => (
                <Cell
                  key={entry.state}
                  fill={
                    entry.state === activeState ?
                      highlightColors[index] :
                      standardColors[index]
                  }
                />
              ))}
            </Bar>
          ))}
      </BarChart>
    </ResponsiveContainer >
  );
}

const TestChart = ({ data }) => {
  const { stateData } = useMainContext()

  return (
    <StackedBarChart
      data={stateData}
      sortBy='totalTestResults'
      seriesList={[
        { key: 'positive', name: 'Positive' },
        { key: 'negative', name: 'Negative' }
      ]}
      xTickFormatter={(tick) => `${tick.toLocaleString()}`}
    />
  )
}

const RateChart = ({ data }) => {
  const { stateData } = useMainContext()

  return (
    <StackedBarChart
      data={stateData}
      sortBy='positiveRate'
      seriesList={[
        { key: 'positiveRate', name: 'Positive (%)' },
        { key: 'negativeRate', name: 'Negative (%)' }
      ]}
      xTickFormatter={ tick => `${_.round(tick * 100, 1)}%`}
    />
  )
}

const TestCoverageChart = () => {
  const { stateData } = useMainContext()

  return (
    <StackedBarChart
      data={stateData}
      sortBy='populationTested'
      seriesList={[
        { key: 'populationTested', name: 'Tested (%)' },
        { key: 'populationUntested', name: 'Untested (%)'}
      ]}
      xTickFormatter={(tick) => `${_.round(tick * 100, 1)}%`}
    />
  )

}

const App = () => {
  const { loading, error, stateData } = useMainContext()

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <Container>
      <Row>
        <Col>
          <h1>Number of Tests by Result</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <TestChart />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Percent of Test By Outcome</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <RateChart />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Percent of Population Tested*</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <TestCoverageChart />
        </Col>
      </Row>
      <Row>
        <Col>
          <p><em>*This assumes that all tests were on unique individuals. It is likely that there are portions of the population that have been tested more than once (e.g. medical personnel) so the percentage of individuals tested may be lower.</em></p>
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
