import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import { useQuery, ApolloProvider } from '@apollo/react-hooks'
import gql from 'graphql-tag';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import _ from 'lodash'
const restLink = new RestLink({ uri: "https://covidtracking.com/api/" });

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});

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

const territories = ['PR', 'AS', 'GU', 'MP', 'VI']


const TestChart = ({ data, active, setActive}) => {
  const onMouseOver = (data) => {
    setActive(data.state)
  }

  return (
    <BarChart width={1200} height={600} data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="state" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar onMouseOver={onMouseOver} dataKey="positive" stackId="a" fill="#8884d8" />
      <Bar onMouseOver={onMouseOver} dataKey="negative" stackId="a" fill="#82ca9d" />
    </BarChart>
  );

}

const RateChart = ({ data }) => {
  
  return (
    <BarChart width={1200} height={600} data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="state" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="positiveRate" stackId="a" fill="#8884d8" />
      <Bar dataKey="negativeRate" stackId="a" fill="#82ca9d" />
    </BarChart>
  );

}

const App = () => {
  const { loading, error, data } = useQuery(GET_STATES);
  const [stateData, setStateData] = useState({})
  const [activeState, setActiveState] = useState(null)

  useEffect(() => {
    if (data) {
      let modifiedData = data['state'].map((item) => {
        return {
          ...item,
          positiveRate: item['positive']/item['totalTestResults'],
          negativeRate: 1 - item['positive']/item['totalTestResults'],
        }
      });
      setStateData(modifiedData.filter( item => !territories.includes(item['state'])))
    }
  }, [data])

  useEffect(()=>{
    console.log(activeState)
  }, [activeState])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <div className="App">
      <TestChart
        data={_.sortBy(stateData, 'totalTestResults')}
        active={activeState}
        setActive={setActiveState}
      />
      <RateChart
        data={_.sortBy(stateData, 'positiveRate')}
      />
      {JSON.stringify(stateData)}
    </div>
  );
}

export default App;
