import React, { useState, useContext, useEffect } from "react";
import statePopulationData from '../utils/statePopulationData'
import omit from 'lodash/omit'

const territories = ['PR', 'AS', 'GU', 'MP', 'VI']

const nodeEnv = process.env.NODE_ENV
const proxy = nodeEnv === 'production' ? '' : process.env.REACT_APP_PROXY_URL
const apiURL = 'https://covidtracking.com/api/'
const domain = `${proxy}${apiURL}`

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
  const [ activeDate, setActiveDate ] = useState(null)

  // This is the data we create charts from
  const [activeDayStateData, setActiveDayStateData] = useState([])

  // Create Daily Snapshots
  const [ snapshots, setSnapshots ] = useState([])

  // Playback Controls
  const [ isPlaying, setIsPlaying ] = useState(false)

  const setActiveDateByIndex = (index) => {
    setActiveDate(dates[index])
  }

  // This effect handles pulling in current totals.
  useEffect(() => {
    setTotalsLoading(true)
    fetch(`${domain}states`)
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
    fetch(`${domain}states/daily`)
      .then(resp => resp.json())
      .then(data => {
        return data.filter(state => !territories.includes(state['state'])).map( record => {
          const stateId = record['state']
          const popData = statePopulationData[stateId]
          const positiveRate = ((record['positive'] || 0) / (record['totalTestResults'] || 0)) || 0
          const negativeRate = 1 - (record['positive'] || 0) / (record['totalTestResults'] || 0)
          const population = popData['population']
          const density = popData['density']
          const name = popData['name']
          const populationTested = record['negative'] ? ((record['totalTestResults'] || 0) / population) || 0 : 0
          const populationUntested = 1 - populationTested
          const deathsPerMillion = (record['death'] || 0) / (population / 1000000)
          const totalResultsPlusPending = (record['totalTestResults'] || 0) + (record['pending'] || 0)
          return {
            ...record,
            positiveRate,
            negativeRate,
            population,
            density,
            name,
            populationTested,
            populationUntested,
            deathsPerMillion,
            totalResultsPlusPending
          }
        })
      })
      .then(augmentedData => {
        const accumulator = {}
        //Create Snapshots
        augmentedData.forEach( record =>{
          const recordDate = record['date']
          accumulator[recordDate] ?
          accumulator[recordDate].push(omit(record, ['date'])) :
          accumulator[recordDate] = [omit(record, ['date'])]
        })

        setSnapshots(accumulator)

        // Dates
        const dateValues = Object.keys(accumulator).sort()
        setDates(Object.keys(accumulator).sort())

        // Set the default date as the currentDate
        setActiveDate(dateValues[dateValues.length -1])
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
    fetch(`${domain}states/info`)
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
    if (activeDate && snapshots) {
      setActiveDayStateData(snapshots[activeDate])
    }
  }, [activeDate, snapshots])

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
        dates,
        setActiveDateByIndex,
        activeDate,
        setActiveDate,
        isPlaying,
        setIsPlaying
      }}
    >
      {children}
    </MainContext.Provider>
  );
};