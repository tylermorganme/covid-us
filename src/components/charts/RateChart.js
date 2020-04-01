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
      />
    )
  }

  export default RateChart
  