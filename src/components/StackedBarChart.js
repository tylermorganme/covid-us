import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import _ from 'lodash'
import { Row, Col, Button } from 'react-bootstrap';
import { useMainContext } from '../providers/MainProvider'
import { standardColors, highlightColors } from '../constants'
import { useWindowWidth } from '@react-hook/window-size/throttled'
import html2canvas from 'html2canvas'
import format from 'date-fns/format'

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
            Download
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

const StackedBarChart = ({ data, seriesList, xTickFormatter, sortBy, title, id, notes }) => {
    const windowWidth = useWindowWidth()
    const { activeState, setActiveState } = useMainContext()
    const onClick = (data) => {
        setActiveState(data.state)
    }
    const xDefaultTickFormatter = tick => (tick)
    const chartData = _.sortBy(data, sortBy)
    const formatter = xTickFormatter ? xTickFormatter : xDefaultTickFormatter
    const height = Math.min(windowWidth, 600)
    return (
        <>
            <div id={id}>
                <Title title={title} notes={notes} />
                <ChartDate />
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={chartData}>
                        <Tooltip formatter={formatter} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="state"
                            interval={windowWidth > 890 ? 0 : 1}
                            tick={<CustomizedAxisTick />}
                        />
                        <YAxis tickFormatter={formatter} />
                        <Tooltip />
                        <Legend />
                        {seriesList.map((series, index) => (
                            <Bar key={series['key']} onClick={onClick} dataKey={series['key']} stackId="a" fill={standardColors[index]} name={series['name']}>
                                {chartData.map(entry => (
                                    <Cell key={entry.state}
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
                {notes ? <Notes notes={notes} /> : null}
            </div>
            <DownloadButton id={id} />
        </>
    );
}

export default StackedBarChart