import React from 'react'
import StackedBarChart from '../StackedBarChart'
import { useMainContext } from '../../providers/MainProvider'
import _ from 'lodash'

const RateChart = ({ data }) => {
    const { activeDayStateData  } = useMainContext()
  
    return (
      <StackedBarChart
        id='rateChart'
        title='Percent of Tests By Outcome'
        data={activeDayStateData }
        sortBy='positiveRate'
        seriesList={[
          { key: 'positiveRate', name: 'Positive (%)' },
          { key: 'negativeRate', name: 'Negative (%)' }
        ]}
        xTickFormatter={tick => `${_.round(tick * 100, 1)}%`}
        notes='States with 100% positive rates in the past were due to them not reporting negatives and limited testing (e.g. Hawaii had only reported 10 test as of 3/17 and all were positive).'
      />
    )
  }

  export default RateChart
  