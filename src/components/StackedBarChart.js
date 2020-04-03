import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Label } from 'recharts'
import _ from 'lodash'
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useMainContext } from '../providers/MainProvider'
import { standardColors, highlightColors } from '../constants'
import { useWindowWidth } from '@react-hook/window-size/throttled'
import html2canvas from 'html2canvas'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import DateSlider from './DateSlider'

const baseDate = new Date()

const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props
    return (
        <g key={payload.value} transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={4}
                dx={0}
                textAnchor="start"
                fill="#666"
                transform="rotate(90)"
                fontFamily="Courier New, monospace"
                fontSize="16px"
            >
                {payload.value}
            </text>
        </g>
    );
}

const ChartDate = () => {
    var currentDate = new Date();
    const { activeDate, dates } = useMainContext()

    if (!dates || !activeDate) { return null }

    if (activeDate === dates[dates.length - 1]) {
        return (
            <Row>
                <Col>
                    <small className="text-muted">{`As of ${format(currentDate, "MM/dd/yyyy' @ 'HH:mm OOOO")} via covidstatsus.com`}</small>
                </Col>
            </Row>
        )
    }

    return (
        <Row>
            <Col>
                <small className="text-muted">{`On ${format(parse(activeDate, 'yyyyMMdd', baseDate), 'M/d')} as of ${format(currentDate, "MM/dd/yyyy' @ 'HH:mm OOOO")} via covidstatsus.com`}</small>
            </Col>
        </Row>
    )

}

const DownloadButton = ({ id }) => {

    return (
        <Button className='ml-auto d-block' variant="outline-dark" onClick={() => {
            const element = document.querySelector(`#${id}`)
            const link = document.createElement('a');
            const currentScroll = document.documentElement.scrollTop
            window.scrollTo(0, 0);
            html2canvas(element).then(canvas => {
                const dataURL = canvas.toDataURL()
                link.download = `${id}.png`
                link.href = dataURL
                link.click()
            }).then(() => window.scrollTo(0, currentScroll))
        }}>
            Download Chart
        </Button>
    )
}

const Notes = ({ notes }) => {
    return (
        <Row>
            <Col>
                <p><em>{`*${notes}`}</em></p>
            </Col>
        </Row>
    )
}

const Title = ({ title, notes }) => {
    return (
        <Row>
            <Col>
                <h2>{`${title}${notes ? "*" : ""}`}</h2>
            </Col>
        </Row>
    )
}

const SliderArea = () => {
    return (
        <Container>
            <Row>
                <Col xs={'auto'}>
                    <h2 className='lead'>Change the Date</h2>
                </Col>
                <Col xs={'auto'} className="d-none d-lg-block">
                    <i className="cil-chevron-right" style={{fontSize:'30px'}} />
                </Col>
                <Col xs={12} lg={9}>
                    <DateSlider />
                </Col>
            </Row>
        </Container>
    )
}


const StackedBarChart = ({ data, seriesList, xTickFormatter, sortBy, title, id, notes, max }) => {
    const windowWidth = useWindowWidth()
    const { activeState, setActiveState } = useMainContext()
    const onClick = (data) => {
        setActiveState(data.state)
    }

    const xDefaultTickFormatter = tick => (tick)
    const formatter = xTickFormatter ? xTickFormatter : xDefaultTickFormatter
    const horizontalHeight = Math.min(windowWidth, 600)
    const verticalHeight = 800


    const widthCutoff = 890
    const isWide = windowWidth > widthCutoff
    const chartData = isWide ? _.sortBy(data, sortBy) : _.sortBy(data, sortBy).reverse()

    const setCellFill = (isHighlighted, index) => {
        return isHighlighted ? highlightColors[index] : standardColors[index]
    }

    return (
        <>
            <div id={id}>
                <Title title={title} notes={notes} />
                <ChartDate />
                <ResponsiveContainer width="100%" height={isWide ? horizontalHeight : verticalHeight}>
                    <BarChart layout={isWide ? "horizontal" : "vertical"} data={chartData}>
                        <Tooltip formatter={formatter} />
                        <CartesianGrid strokeDasharray="3 3" />
                        {isWide ?
                            <XAxis dataKey="state" interval={0} tick={<CustomizedAxisTick />} /> :
                            <YAxis dataKey="state" interval={0} type="category" />}
                        {isWide ?
                            <YAxis tickFormatter={formatter} domain={[0, max ? max : 'auto']} /> :
                            <XAxis tickFormatter={formatter} type="number" />}
                        <Tooltip />
                        <Legend />
                        {seriesList.map((series, index) => (
                            <Bar key={series['key']} onClick={onClick} dataKey={series['key']} stackId="a" fill={standardColors[index]} name={series['name']}>
                                {chartData.map(entry => (
                                    <Cell key={entry.state}
                                        fill={setCellFill(entry.state === activeState, index)}
                                    />
                                ))}
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer >
                {notes ? <Notes notes={notes} /> : null}
            </div>
            <SliderArea />
            <DownloadButton id={id} />
        </>
    );
}

export default StackedBarChart