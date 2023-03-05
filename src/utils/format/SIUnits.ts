import { last } from "lodash"

export namespace SIUints {
  const units = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
    { value: 1, symbol: "" },
  ]
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/

  export function format(value: number | string, digits = 0) {
    const target = Number(value)
    if (isNaN(target)) {
      throw new NotNumberError()
    }
    const unit = units.find((unit) => unit.value <= target) ?? last(units)
    return `${(target / unit.value).toFixed(digits).replace(regex, "$1")}${
      unit.symbol
    }`
  }
}

export class NotNumberError extends Error {}
