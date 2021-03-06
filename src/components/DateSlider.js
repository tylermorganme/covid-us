import React, { useEffect, useState } from 'react'
import Slider from '@material-ui/core/Slider'
import { useMainContext } from '../providers/MainProvider'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import { withStyles } from '@material-ui/core/styles';

const baseDate = new Date()

const StyledSlider = withStyles({
    root: {
        color: '#343A40',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    mark: {
        backgroundColor: 'white',
        height: 8,
        width: 3,
        // marginTop: -3,
    },
    // active: {},
    // valueLabel: {
    //     left: 'calc(-50% + 4px)',
    // },
    track: {
        height: 8,
        // borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider)

const makeMarks = (dates, labelInterval) => {
    const numDates = dates.length - 1 
    return dates.map((value, index) => {
        if (index === 0 || index === numDates || ((index % labelInterval === 0) && !(numDates - index < labelInterval))) {
            return {
                label: format(parse(value, 'yyyyMMdd', baseDate), 'M/d'),
                value: index
            }
        } else {
            return {
                value: index
            }
        }
    })
}

const DateSlider = () => {
    const [value, setValue] = React.useState(null);

    const { dates, setActiveDateByIndex, activeDate } = useMainContext()
    const [max, setMax] = useState()

    function valueLabelFormat(value) {
        return format(parse(dates[value], 'yyyyMMdd', baseDate), 'M/d')
    }

    useEffect(() => {
        if (dates) {
            setValue(dates.length - 1)
            setMax(dates.length - 1)
        }
    }, [dates])

    useEffect(() => {
        if (dates && activeDate) {
            setValue(dates.indexOf(activeDate))
        }
    }, [dates, activeDate])

    const handleChange = (event, newValue) => {
        setActiveDateByIndex(newValue)
    };

    return (
        <div>
            <StyledSlider
                value={value}
                min={0}
                step={1}
                max={max}
                getAriaValueText={dates ? valueLabelFormat : null}
                valueLabelFormat={dates ? valueLabelFormat : null}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="linear-slider"
                marks={dates ? makeMarks(dates, 4) : null}
            />
        </div>
    )
}

export default DateSlider