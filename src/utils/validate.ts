import { getAddress } from "@ethersproject/address"
import { BigNumber } from "ethers"

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string): boolean {
  return /^0x0*$/.test(hexNumberString)
}

export const isEmptyValue = (text: string) =>
  BigNumber.isBigNumber(text)
    ? BigNumber.from(text).isZero()
    : text === "" || text.replace(/0/g, "").replace(/\./, "") === ""

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function isEmptyObj(obj: { constructor?: any }) {
  if (
    obj !== undefined &&
    obj !== null &&
    obj.constructor === Object &&
    Object.keys(obj).length === 0
  ) {
    return true
  }

  return false
}
