import React from 'react'
import StackedBarChart from '../StackedBarChart'
import { useMainContext } from '../../providers/MainProvider'

const TestChart = ({ data }) => {
    const { activeDayStateData  } = useMainContext()
  
    return (
      <StackedBarChart
        id="testChart"
        title='Number of Tests by Result'
        data={activeDayStateData }
        sortBy='totalTestResults'
        seriesList={[
          { key: 'positive', name: 'Positive' },
          { key: 'negative', name: 'Negative' }
        ]}
        xTickFormatter={(tick) => `${tick.toLocaleString()}`}
      />
    )
  }

  export default TestChart