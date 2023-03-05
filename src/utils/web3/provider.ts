import { StaticJsonRpcProvider } from "@ethersproject/providers"
import { getChain } from "constants/chains"

function getNetworkURI(chainId?: number): string {
  const chainID = chainId || parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
  return getChain(chainID).rpcUrls[0]
}

let provider: StaticJsonRpcProvider = null

export function getProvider(chainId?: number) {
  if (!provider) {
    provider = new StaticJsonRpcProvider(getNetworkURI(chainId))
  }

  return provider
}
