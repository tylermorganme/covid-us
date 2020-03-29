import React, { useEffect, useState } from 'react';
import './App.css';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import _ from 'lodash'
import { Container, Row, Col } from 'react-bootstrap';
import { useMainContext } from './providers/MainProvider'

const GET_STATES = gql`
  query luke {
    state @rest(type: "State", path: "states") {
      state,
      positive,
      positiveScore,
      negative,
      negativeScore,
      negativeRegularScore,
      commercialScore,
      score,
      grade,
      totalTestResults,
      hospitalized,
      death,
      dateModified,
      dateChecked,
      total
    }
  }
`;

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

function invertColor(hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

const constants = {
  colors: {
    fill1: "#8884d8",
    fill2: "#82ca9d",
    highlight1: invertColor("#8884d8"),
    highlight2: invertColor("#82ca9d")
  }
}

const territories = ['PR', 'AS', 'GU', 'MP', 'VI']

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
        <Bar key="positive" onClick={onClick} dataKey="positive" stackId="a" fill={constants.colors.fill1}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  constants.colors.highlight1 :
                  constants.colors.fill1
              }
            />
          ))}
        </Bar>
        <Bar key="negative" onClick={onClick} dataKey="negative" stackId="a" fill={constants.colors.fill2}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  constants.colors.highlight2 :
                  constants.colors.fill2
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
        <Bar key="positiveRate" onClick={onClick} dataKey="positiveRate" stackId="a" fill={constants.colors.fill1}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  constants.colors.highlight1 :
                  constants.colors.fill1
              }
            />
          ))}
        </Bar>
        <Bar key="negativeRate" onClick={onClick} dataKey="negativeRate" stackId="a" fill={constants.colors.fill2}>
          {data.map((entry, index) => (
            <Cell
              key={entry.state}
              fill={
                entry.state === activeState ?
                  constants.colors.highlight2 :
                  constants.colors.fill2
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

}

const App = () => {
  const { loading, error, data } = useQuery(GET_STATES);
  const [stateData, setStateData] = useState({})

  useEffect(() => {
    if (data) {
      let modifiedData = data['state'].map((item) => {
        return {
          ...item,
          positiveRate: item['positive'] / item['totalTestResults'],
          negativeRate: 1 - item['positive'] / item['totalTestResults'],
        }
      });
      setStateData(modifiedData.filter(item => !territories.includes(item['state'])))
    }
  }, [data])


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
          {JSON.stringify(stateData)}
        </Col>
      </Row>
      <Row>
        <Col>
          {JSON.stringify(stateData)}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
