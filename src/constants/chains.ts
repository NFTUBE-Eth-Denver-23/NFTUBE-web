import { ChainId, ChainTag } from "types/index"

export interface Chain {
  chainId: number
  chainName: string
  chainTag: string
  rpcUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorerUrls: string[]
  etherscanApiUrl?: string
  icon: string
}

type ChainById = Record<ChainId, Chain>
// DO NOT CHANGE KEY PROPERTIES
// Metamask needs exactly these properties to work (e.g adding new network, additional keys will break that)

export const chainIdByTag = {
  [ChainTag.MAINNET]: ChainId.MAINNET,
  [ChainTag.POLYGON_MAINNET]: ChainId.POLYGON_MAINNET,
  [ChainTag.AURORA_MAINNET]: ChainId.AURORA_MAINNET,
  [ChainTag.AURORA_TESTNET]: ChainId.AURORA_TESTNET,
  [ChainTag.NEON_DEVNET]: ChainId.NEON_DEVNET,
  [ChainTag.MANTLE_TESTNET]: ChainId.MANTLE_TESTNET,
  [ChainTag.FUEL_MAINNET]: ChainId.FUEL_MAINNET,
  [ChainTag.LOCAL_TESTNET]: ChainId.LOCAL_TESTNET,
  // [ChainTag.RINKEBY_TESTNET]: ChainId.RINKEBY_TESTNET,
}

export const chains = {
  [ChainId.MAINNET]: {
    chainId: ChainId.MAINNET,
    chainName: "Ethereum",
    //chain tag used for backend & moralis
    chainTag: ChainTag.MAINNET,
    rpcUrls: [
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_ETHEREUM_INFURA_ID}`,
    ],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io"],
    icon: "/icons/ethereum.svg",
  },
  [ChainId.POLYGON_MAINNET]: {
    chainId: ChainId.POLYGON_MAINNET,
    chainName: "Polygon",
    chainTag: ChainTag.POLYGON_MAINNET,
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com"],
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    icon: "/icons/polygon.svg",
  },
  [ChainId.AURORA_MAINNET]: {
    chainId: ChainId.AURORA_MAINNET,
    chainName: "Aurora",
    chainTag: ChainTag.AURORA_MAINNET,
    rpcUrls: ["https://mainnet.aurora.dev/"],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: "Aurora",
      symbol: "aETH",
      decimals: 18,
    },
    icon: "/icons/aurora.svg",
  },
  // [ChainId.AURORA_TESTNET]: {
  //   chainId: ChainId.AURORA_TESTNET,
  //   chainName: "Aurora",
  //   //chain tag used for backend & moralis
  //   chainTag: ChainTag.AURORA_TESTNET,
  //   rpcUrls: [`https://testnet.aurora.dev/`],
  //   nativeCurrency: {
  //     name: "Aurora",
  //     symbol: "aETH",
  //     decimals: 18,
  //   },
  //   blockExplorerUrls: [],
  //   icon: "/icons/ethereum.svg",
  // },
  [ChainId.NEON_DEVNET]: {
    chainId: ChainId.NEON_DEVNET,
    chainName: "Neon",
    //chain tag used for backend & moralis
    chainTag: ChainTag.NEON_DEVNET,
    rpcUrls: [`https://devnet.neonevm.org/`],
    nativeCurrency: {
      name: "Neon",
      symbol: "NEON",
      decimals: 18,
    },
    blockExplorerUrls: [],
    icon: "/icons/neon.png",
  },
  [ChainId.MANTLE_TESTNET]: {
    chainId: ChainId.MANTLE_TESTNET,
    chainName: "Mantle",
    //chain tag used for backend & moralis
    chainTag: ChainTag.MANTLE_TESTNET,
    rpcUrls: ["https://rpc.testnet.mantle.xyz/"],
    nativeCurrency: {
      name: "Mantle",
      symbol: "Mantle",
      decimals: 18,
    },
    blockExplorerUrls: [],
    icon: "/icons/mantle.svg",
  },

  [ChainId.LOCAL_TESTNET]: {
    chainId: ChainId.LOCAL_TESTNET,
    chainName: "Localhost",
    chainTag: ChainTag.LOCAL_TESTNET,
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    icon: "/icons/ethereum.svg",
  },
  // [ChainId.RINKEBY_TESTNET]: {
  //   chainId: ChainId.RINKEBY_TESTNET,
  //   chainName: "Rinkeby",
  //   chainTag: ChainTag.RINKEBY_TESTNET,
  //   rpcUrls: ["https://rinkeby.infura.io/v3/"],
  //   blockExplorerUrls: ["https://rinkeby.etherscan.io"],
  //   nativeCurrency: {
  //     name: "ETH",
  //     symbol: "RinkebyETH",
  //     decimals: 18,
  //   },
  //   icon: "/icons/ethereum.svg",
  // },
}

export const getChainTagById = (chainId: number) => {
  return getChain(chainId).chainTag
}

export const getChain = (chainId: number) => {
  return chains[chainId]
}

export const getChainByTag = (chainTag: number) => {
  return chains[chainIdByTag[chainTag]]
}

export const isSupportedChain = (chainId: number) => {
  return chains[chainId] && true
}

export const DEFAULT_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
