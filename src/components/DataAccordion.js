import React from 'react'
import {Accordion, Card} from 'react-bootstrap'
import {useMainContext} from '../providers/MainProvider'

const DataAccordion = () => {
    const { activeDayStateData } = useMainContext()
  
    return (
      <Accordion>
        {activeDayStateData.map((state, index) => (
          <Card key={state['name']}>
            <Accordion.Toggle className="data-accordion-header" as={Card.Header} eventKey={index.toString()}>
              {state['name']}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>
                <ul>
                  {Object.entries(state).map(([key, value], index) => (
                    ['name', '__typename'].includes(key) ? null : <li key={key}>{`${key}: ${value}`}</li>
                  ))}
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    )
  }

export default DataAccordion