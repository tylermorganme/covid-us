import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import './App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import _ from 'lodash'
import { Container, Row, Col, Table, Navbar, Jumbotron, Accordion, Card, Button } from 'react-bootstrap';
import { useMainContext } from './providers/MainProvider'
import { standardColors, highlightColors } from './constants'
import { useWindowWidth } from '@react-hook/window-size/throttled'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  PocketShareButton,
  PocketIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon
} from "react-share"

import html2canvas from 'html2canvas'

import format from 'date-fns/format'

// import { svgAsPngUri } from 'save-svg-as-png'

const CustomizedAxisTick = ({ x, y, payload }) => {
  const windowWidth = useWindowWidth()
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={4}
        dx={0}
        textAnchor="start"
        fill="#666"
        transform="rotate(90)"
        fontFamily="Courier New"
        fontSize="16px"
        // fontSize={`${Math.min(16, windowWidth/60)}px`}
        fontSizeAdjust={(windowWidth / 1600).toString()}
      >
        {payload.value}
      </text>
    </g>
  );
}

const ChartDate = () => {
  var currentDate = new Date();

  return (
    <Row>
      <Col>
        <small className="text-muted">{`As of ${format(currentDate, "MM/dd/yyyy' @ 'HH:mm OOOO")} via covidstatsus.com`}</small>
      </Col>
    </Row>
  )
}

const StackedBarChart = ({ data, seriesList, xTickFormatter, sortBy, title, id, notes}) => {
  const { activeState, setActiveState } = useMainContext()
  const windowWidth = useWindowWidth()
  const onClick = (data) => {
    setActiveState(data.state)
  }

  const xDefaultTickFormatter = tick => (tick)

  const chartData = _.sortBy(data, sortBy)

  return (
    <>
      <div id={id}>
        <Row>
          <Col>
            <h2>{`${title}${notes?"*":""}`}</h2>
          </Col>
        </Row>
        <ChartDate />
        <ResponsiveContainer width="100%" height={Math.min(windowWidth, 600)}>
          <BarChart
            data={chartData}
          // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <Tooltip formatter={xTickFormatter ? xTickFormatter : xDefaultTickFormatter} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="state"
              interval={windowWidth > 890 ? 0 : 1}
              tick={<CustomizedAxisTick />}
            />
            <YAxis tickFormatter={xTickFormatter ? xTickFormatter : xDefaultTickFormatter} />
            <Tooltip />
            <Legend />
            {seriesList.map((series, index) => (
              <Bar key={series['key']} onClick={onClick} dataKey={series['key']} stackId="a" fill={standardColors[index]} name={series['name']}>
                {chartData.map(entry => (
                  <Cell
                    key={entry.state}
                    fill={
                      entry.state === activeState ?
                        highlightColors[index] :
                        standardColors[index]
                    }
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer >
        {
          notes?
          <Row>
            <Col>
              <p><em>{`*${notes}`}</em></p>
            </Col>
          </Row>:
          null
        }
      </div>
      <Button className='ml-auto d-block' variant="outline-dark" onClick={() => {
        const element =document.querySelector(`#${id}`)
        const link = document.createElement('a');
        const currentScroll = document.documentElement.scrollTop
        window.scrollTo(0,0); 
        html2canvas(element).then(canvas => {
          const dataURL = canvas.toDataURL()
          console.log(dataURL)
          link.download = `${id}.png`
          link.href = dataURL
          console.log(dataURL)
          link.click()
        }).then(()=>window.scrollTo(0,currentScroll)) 
      }}>
        Download
      </Button>
    </>
  );
}

const TestChart = ({ data }) => {
  const { stateData } = useMainContext()

  return (
    <StackedBarChart
      id="testChart"
      title='Number of Tests by Result'
      data={stateData}
      sortBy='totalTestResults'
      seriesList={[
        { key: 'positive', name: 'Positive' },
        { key: 'negative', name: 'Negative' }
      ]}
      xTickFormatter={(tick) => `${tick.toLocaleString()}`}
    />
  )
}

const RateChart = ({ data }) => {
  const { stateData } = useMainContext()

  return (
    <StackedBarChart
      id='rateChart'
      title='Percent of Tests By Outcome'
      data={stateData}
      sortBy='positiveRate'
      seriesList={[
        { key: 'positiveRate', name: 'Positive (%)' },
        { key: 'negativeRate', name: 'Negative (%)' }
      ]}
      xTickFormatter={tick => `${_.round(tick * 100, 1)}%`}
    />
  )
}

const TestCoverageChart = () => {
  const { stateData } = useMainContext()

  return (
    <StackedBarChart
      id='testCoverageChart'
      title='Percent of Population Tested'
      data={stateData}
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

const DataAccordion = () => {
  const { stateData } = useMainContext()

  return (
    <Accordion>
      {stateData.map((state, index) => (
        <Card key={stateData['name']}>
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

const DataTable = () => {
  const { stateData } = useMainContext()

  let columns = [
    // {
    //   dataField: "name",
    //   text:"Name",
    // },
    {
      dataField: "state",
      text: "State",
      sort: true
    },
    {
      dataField: "positive",
      text: "Positive"
    },
    {
      dataField: "negative",
      text: "Negative"
    },
    {
      dataField: "negativeScore",
      text: "Negative Score"
    },
    {
      dataField: "negativeRegularScore",
      text: "Negative Regular Score"
    },
    {
      dataField: "commercialScore",
      text: "Commercial Score"
    },
    // { 
    //   dataField: "score",
    //   text: "Score"
    // },
    // { 
    //   dataField: "grade",
    //   text: "Grade"
    // },
    {
      dataField: "totalTestResults",
      text: "Total Test Results"
    },
    {
      dataField: "hospitalized",
      text: "Hospitalized"
    },
    {
      dataField: "death",
      text: "Death"
    },
    {
      dataField: "population",
      text: "Population"
    },
    {
      dataField: "density",
      text: "Density"
    },
    {
      dataField: "dateModified",
      text: "Date Modified"
    },
    {
      dataField: "dateChecked",
      text: "Date Checked"
    }
  ]

  columns = columns.map(column => ({ ...column, headerClasses: 'sticky' }))

  return (
    <Row style={{marginTop: '15px'}}>
      <Col>
        <BootstrapTable keyField='name' data={stateData} columns={columns} />
        <Table striped bordered responsive >
        </Table>
      </Col>
    </Row>
  )
}

const SocialSharingLinks = () => {
  const summaryText = "COVID Stats U.S. - Trusted COVID-19 Data"
  // const description = "Quickly compare COVID-19 metrics across the Unites States using official state reported data."

  // if (isBrowser()) { url = window.location.href; }
  let url = 'https://covidstatsus.com'

  return (
    <Row>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <FacebookShareButton url={url} quote={summaryText}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <TwitterShareButton url={url} title={summaryText} via="tylermorganme">
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <RedditShareButton url={url} title={summaryText}>
          <RedditIcon size={32} round />
        </RedditShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <PocketShareButton url={url} title={summaryText}>
          <PocketIcon size={32} round />
        </PocketShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <PinterestShareButton url={url} description={summaryText}>
          <PinterestIcon size={32} round />
        </PinterestShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <EmailShareButton url={url} subject={summaryText} body="I thought you might be intersted in looking at this data.">
          <EmailIcon size={32} round />
        </EmailShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <WhatsappShareButton url={url} title={summaryText}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </Col>
      <Col style={{ flexGrow: 0, paddingTop: "15px" }}>
        <LinkedinShareButton url={url} summary={summaryText} source="COVID Stats U.S.">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </Col>
    </Row>
  )
}

const App = () => {
  const { error } = useMainContext()
  const windowWidth = useWindowWidth()

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{JSON.stringify(error)}</p>;

  return (
    <>
      <header>
        <Container fluid>
          <Navbar bg="dark" expand="lg">
            <Navbar.Brand href="#home" style={{ color: "white", fontFamily: 'Open Sans, sans-serif', fontSize: '25px' }}>
              COVID STATS <span style={{ color: standardColors[0] }}>U</span>.<span style={{ color: standardColors[1] }}>S</span>.
            </Navbar.Brand>
          </Navbar>
        </Container>
      </header>
      <main>
        <Container>
          <Jumbotron>
            <Container >
              <p className="lead"><strong>Welcome to COVID Stats U.S.</strong></p>
              <p className="lead"> This project started out as my own attempt to understand what the COVID situation looked like in the U.S. and rapidly grew into a tool that I hope you will find useful. This is a work in progress so stay-tuned for updates.</p>
              <p className="lead">The majority of the data is provided by the hard work of the folks at <a href="http://www.covidtracking.com/">covidtracking.com</a>.</p>
              <p className="lead">Clicking on the data for any state will highlight that state in all graphs.</p>
              <p className="lead">If you have questions or comments <a href="https://twitter.com/TylerMorganMe"> feel free to reach out</a>.</p>
              <p className="lead">Enjoy and please share!</p>
              <SocialSharingLinks />
            </Container>
          </Jumbotron>
          <Row>
            <Col>
              <TestChart />
            </Col>
          </Row>
          <Row>
            <Col>
              <RateChart />
            </Col>
          </Row>
          <Row>
            <Col>
              <TestCoverageChart />
            </Col>
          </Row>
        </Container>
        <Container fluid={windowWidth > 1000} id='tableContainer'>
          {windowWidth > 1000 ?
            <DataTable /> :
            <>
              <h3>Click a state below to see the raw data for that state.</h3>
              <DataAccordion />
            </>}
        </Container>
      </main>
    </>
  );
}

export default App;
