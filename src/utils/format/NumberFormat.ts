import { ChangeEvent } from "react"
import { commaizeNumber } from "utils/format/commaizeNumber"

export namespace NumberFormat {
  function createNumberFormatter(format: (num: number) => number) {
    return function (value: number, unit: number) {
      if (unit < 1) {
        const reciprocal = 1 / unit
        return format(value * reciprocal) / reciprocal
      }
      return format(value / unit) * unit
    }
  }

  export const ceil = createNumberFormatter(Math.ceil)

  export const floor = createNumberFormatter(Math.floor)

  export const round = createNumberFormatter(Math.round)

  export const commaizWithFallback = (
    value?: string | number,
    options?: {
      decimals?: number
      fallback?: string
    }
  ) => {
    if (!value) {
      return options?.fallback ?? "-"
    }
    return commaizeNumber(value, { decimals: options?.decimals })
  }
}

/**
 *
 * @param {}
 */
export function formatNumberConsideringFloat(
  value: string | null,
  currentData: string | null
) {
  let formattedValue = value
  if (value === "") {
    formattedValue = "0"
  } else if (
    value[0] === "0" &&
    value.length === 2 &&
    currentData &&
    currentData !== "."
  ) {
    formattedValue = "0." + currentData
  }
  return formattedValue
}

export function formatNumber(value: string | null) {
  let currentValue = value
  let parsedValue = Number(currentValue).toString()
  return parsedValue
}
