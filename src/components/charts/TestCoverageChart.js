import React from 'react'
import StackedBarChart from '../StackedBarChart'
import { useMainContext } from '../../providers/MainProvider'
import _ from 'lodash'

const TestCoverageChart = () => {
    const { activeDayStateData  } = useMainContext()
  
    return (
      <StackedBarChart
        id='testCoverageChart'
        title='Percent of Population Tested'
        data={activeDayStateData }
        sortBy='populationTested'
        seriesList={[
          { key: 'populationTested', name: 'Tested (%)' },
          { key: 'populationUntested', name: 'Untested (%)' }
        ]}
        xTickFormatter={(tick) => `${_.round(tick * 100, 1)}%`}
        notes="This assumes that all tests were on unique individuals. It is likely that there are portions of the population that have been tested more than once (e.g. medical personnel) so the percentage of individuals tested may be lower."
      />
    )
  }

  export default TestCoverageChart




  
