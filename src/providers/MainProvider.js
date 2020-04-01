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
  const [ activeDayStateData , setActiveDayStateData ] = useState([])

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
          const populationTested = state['totalTestResults']/population
          const populationUntested = 1 - populationTested
          const deathsPerMillion = state['death']/(population/1000000)
          return {
            ...state,
            positiveRate,
            negativeRate,
            population,
            density,
            name,
            populationTested,
            populationUntested,
            deathsPerMillion
          }
        });
      setActiveDayStateData(modifiedData)
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
          activeDayStateData,
          setActiveDayStateData
      }}
    >
      {children}
    </MainContext.Provider>
  );
};