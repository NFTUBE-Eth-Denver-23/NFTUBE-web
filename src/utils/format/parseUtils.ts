import { ethers, utils } from "ethers"

export function parseBigNumberToFloat(
  val: ethers.BigNumber,
  decimals: number = 18
) {
  const formatted = utils.formatUnits(val, decimals)
  const parsed = parseFloat(formatted)
  return parsed
}

export function parseBigNumberToInt(
  val: ethers.BigNumber,
  decimals: number = 18
) {
  const formatted = utils.formatUnits(val, decimals)
  const parsed = parseInt(formatted)
  return parsed
}

/**
 *
 * @param val number to be formatted
 * @param decimals number of decimal places
 * @returns number
 * @description trims the passed val to the passed decimals but doesn't round up, useful for max values of tokens
 */
export function parseToFixed(val: number, decimals: number) {
  if (!val) {
    return 0
  }

  const multiplier = Math.pow(10, decimals)
  const fixed = Math.floor(val * multiplier) / multiplier
  return fixed
}

export function parseSecondsToReadable(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return { days, hours, minutes }
}

export function parseEthersErrorMessage(error: any) {
  if (error?.data?.message) {
    const [, message] = error.data.message.split(
      "Error: VM Exception while processing transaction: reverted with reason string "
    )
    return message
  } else if (error?.message) {
    return error.message
  } else return "Encountered an error"
}
