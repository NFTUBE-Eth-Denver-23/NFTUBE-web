import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

import { chains } from "constants/index"

// Add all the supported chains.
export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(chains).map((key) => chains[key].chainId),
})

// Reformat chains mapping
const chainIdToRpcUrls = Object.fromEntries(
  Object.entries(chains).map(([chainId, { rpcUrls }]) => [chainId, rpcUrls[0]])
)

export const walletconnect = new WalletConnectConnector({
  rpc: chainIdToRpcUrls,
  qrcode: true,
})
