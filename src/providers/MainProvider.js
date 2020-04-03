import React, { useState, useContext, useEffect } from "react";
import statePopulationData from '../utils/statePopulationData'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'
import find from 'lodash/find'
import Slider from '@material-ui/core/Slider';

const territories = ['PR', 'AS', 'GU', 'MP', 'VI']
export const MainContext = React.createContext();
export const useMainContext = () => useContext(MainContext);
export const MainProvider = ({ children }) => {
  // This is the state that is currently selected for highlighting
  const [activeState, setActiveState] = useState(null);

  // Totals
  const [totalsLoading, setTotalsLoading] = useState(null);
  const [totalsError, setTotalsError] = useState(null);
  const [totals, setTotals] = useState(null)

  // Daily Data
  const [dailyDataLoading, setDailyDataLoading] = useState(null);
  const [dailyDataError, setDailyDataError] = useState(null);
  const [dailyData, setDailyData] = useState(null)

  // Info
  const [statesInfoLoading, setStatesInfoLoading] = useState(null);
  const [statesInfoError, setStatesInfoError] = useState(null);
  const [statesInfo,setStatesInfo] = useState(null)
  const [dates, setDates] = useState(null)

  // Dates
  const [ minDate, setMinDate] = useState(null)
  const [ maxDate, setMaxDate] = useState(null)
  const [ activeDate, setActiveDate ] = useState(null)

  // This is the data we create charts from
  const [activeDayStateData, setActiveDayStateData] = useState([])

  const setActiveDateByIndex = (index) => {
    setActiveDate(dates[index])
  }

  // This effect handles pulling in current totals.
  useEffect(() => {
    setTotalsLoading(true)
    fetch('https://lychee-pudding-66431.herokuapp.com/https://covidtracking.com/api/states')
      .then(resp => resp.json())
      .then((data) => {
        setTotals(data)
        setTotalsLoading(false)
      })
      .catch(error => {
        console.log(error)
        setTotalsError(error)
        setTotalsLoading(false)
      })
  }, [])

  // This effect handles pulling in historica data.
  useEffect(() => {
    setDailyDataLoading(true)
    fetch('https://lychee-pudding-66431.herokuapp.com/https://covidtracking.com/api/states/daily')
      .then(resp => resp.json())
      .then(data => {
        return data.filter(state => !territories.includes(state['state'])).map( record => {
          const stateId = record['state']
          const popData = statePopulationData[stateId]
          const positiveRate = record['positive'] / record['totalTestResults']
          const negativeRate = 1 - record['positive'] / record['totalTestResults']
          const population = popData['population']
          const density = popData['density']
          const name = popData['name']
          const populationTested = record['totalTestResults'] / population
          const populationUntested = 1 - populationTested
          const deathsPerMillion = record['death'] / (population / 1000000)
          return {
            ...record,
            positiveRate,
            negativeRate,
            population,
            density,
            name,
            populationTested,
            populationUntested,
            deathsPerMillion
          }
        })
      })
      .then(augmentedData => {
        //Get the min and max date
        const minDate = minBy(augmentedData, 'date')['date']
        const maxDate = maxBy(augmentedData, 'date')['date']
        setMinDate(minDate)
        setMaxDate(maxDate)

        // We create a set to remove duplicates then covert back to an array for sorting.
        setDates(Array.from(new Set(augmentedData.map( record => {
          return record['date']
        }))).sort())

        // Set the default date as the currentDate
        setActiveDate(maxDate)
        setDailyData(augmentedData)
        setDailyDataLoading(false)
      })
      .catch(error => {
        console.log(error)
        setDailyDataError(error)
        setDailyDataLoading(false)
      })
  }, [])

  // This effect handles pulling everything in state info.=
  useEffect(() => {
    setStatesInfoLoading(true)
    fetch('https://lychee-pudding-66431.herokuapp.com/https://covidtracking.com/api/states/info')
      .then(resp => resp.json())
      .then((data) => {
        setStatesInfo(data)
        setStatesInfoLoading(false)
      })
      .catch(error => {
        console.log(error)
        setStatesInfoError(error)
        setStatesInfoLoading(false)
      })
  }, [])


  // Set the activate days data based on activate date
  useEffect(()=> {
    // Check to make sure all the data has been loaded before compiling.
    if (activeDate && totals && statesInfo && dailyData) {
      const data = totals.filter(state => !territories.includes(state['state'])).map( state => {
        const stateName = state['state']
        const stateInfo = find(statesInfo, {state: stateName})
        const stateDaily = find(dailyData, {state: stateName, date: activeDate})
        return {
          ...state,
          ...stateInfo,
          ...stateDaily
        }
      })
      setActiveDayStateData(data)
    }
  }, [activeDate, totals, statesInfo, dailyData])

  return (
    <MainContext.Provider
      value={{
        activeState,
        setActiveState,
        totals,
        totalsLoading,
        totalsError,
        activeDayStateData,
        setActiveDayStateData,
        dailyDataLoading,
        setDailyDataLoading,
        dailyDataError,
        setDailyDataError,
        dailyData,
        setDailyData,
        statesInfoLoading,
        setStatesInfoLoading,
        statesInfoError,
        setStatesInfoError,
        statesInfo,
        setStatesInfo,
        minDate,
        maxDate,
        dates,
        setActiveDateByIndex,
        activeDate,
        setActiveDate
      }}
    >
      {children}
    </MainContext.Provider>
  );
};