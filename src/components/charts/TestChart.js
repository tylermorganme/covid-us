import React from 'react'
import StackedBarChart from '../StackedBarChart'
import { useMainContext } from '../../providers/MainProvider'
import maxBy from 'lodash/maxBy'
import ceil from 'lodash/ceil'

const superCeil = (num) => {
  const exponent = Math.floor(Math.log(num)/Math.log(10)) -1
  return ceil(num, -exponent)
}

const TestChart = ({ data }) => {
    const { activeDayStateData, dailyData } = useMainContext()
    const max = maxBy(dailyData, 'totalResultsPlusPending') && maxBy(dailyData, 'totalResultsPlusPending')['totalResultsPlusPending']
    return (
      <StackedBarChart
        id="testChart"
        title='Number of Tests by Result'
        data={activeDayStateData }
        sortBy='totalResultsPlusPending'
        seriesList={[
          { key: 'positive', name: 'Positive' },
          { key: 'negative', name: 'Negative' },
          { key: 'pending', name: 'Pending' }
        ]}
        yTickFormatter={(tick) => tick.toLocaleString()}
        max={superCeil(max)}
      />
    )
  }

  export default TestChart