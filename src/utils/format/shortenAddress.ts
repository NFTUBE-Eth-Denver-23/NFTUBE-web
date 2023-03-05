import { getAddress } from "@ethersproject/address"

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "--"
  const parsed = getAddress(address)
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}
