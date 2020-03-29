import React, { useState, useContext, useEffect} from "react";
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import statePopulationData from '../utils/statePopulationData'

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

export const MainContext = React.createContext();
export const useMainContext = () => useContext(MainContext);
export const MainProvider = ({children}) => {
  const [activeState, setActiveState] = useState(null);
  const { data, loading, error } = useQuery(GET_STATES);
  const [ stateData, setStateData ] = useState([])

  useEffect(() => {
    if (data) {
      let modifiedData = data['state']
        .filter(item => !territories.includes(item['state']))
        .map((state) => {
          // console.log(state)
          const positiveRate = state['positive'] / state['totalTestResults']
          const negativeRate = 1 - state['positive'] / state['totalTestResults']
          const population = statePopulationData[state['state']]['population']
          const density = statePopulationData[state['state']]['density']
          const name = statePopulationData[state['state']]['name']
          return {
            ...state,
            positiveRate,
            negativeRate,
            population,
            density,
            name,
            testCoverage: state['totalTestResults']/population,
            deathPerMillion: state['death']/(population/1000000)
          }
        });
      setStateData(modifiedData)
    }
  }, [data])

  return (
    <MainContext.Provider
      value={{
          activeState,
          setActiveState,
          data,
          loading,
          error,
          stateData,
          setStateData
      }}
    >
      {children}
    </MainContext.Provider>
  );
};