import { useWeb3React } from "@web3-react/core"

import { DEFAULT_CHAIN_ID } from "constants/index"
import { ChainId } from "types/index"

export function useChainId(): ChainId {
  const { chainId } = useWeb3React()
  return chainId ?? DEFAULT_CHAIN_ID
}
