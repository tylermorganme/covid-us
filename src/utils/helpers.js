import round from 'lodash/round'

export const isBrowser = () => {
    return !(typeof document === "undefined" || typeof window === "undefined");
}

export const formatAsPercent = (value, precision = 0) => {
    return `${round(value * 100, precision)}%`
}