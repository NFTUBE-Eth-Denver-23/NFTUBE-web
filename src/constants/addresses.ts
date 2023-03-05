import { ChainId } from "types/ChainId"

interface IAddresses {
  [chainId: number]: {
    NFTUBE_MANAGER_ADDRESS: string
  }
}

export const addresses: IAddresses = {
  //LOCAL
  [ChainId.LOCAL_TESTNET]: {
    NFTUBE_MANAGER_ADDRESS: "0xD2D5e508C82EFc205cAFA4Ad969a4395Babce026",
  },
  //ETH MAINNET
  [ChainId.MAINNET]: {
    NFTUBE_MANAGER_ADDRESS: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
  },
  //POLYGON
  [ChainId.POLYGON_MAINNET]: {
    NFTUBE_MANAGER_ADDRESS: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
  },
  //NEON
  [ChainId.NEON_DEVNET]: {
    NFTUBE_MANAGER_ADDRESS: "0x4D46c584A47ed0B8F5b5B569Bf20b8328d39fca3",
  },
  //MANTLE
  [ChainId.MANTLE_TESTNET]: {
    NFTUBE_MANAGER_ADDRESS: "0x4D46c584A47ed0B8F5b5B569Bf20b8328d39fca3",
  },
  //AURORA
  [ChainId.AURORA_MAINNET]: {
    NFTUBE_MANAGER_ADDRESS: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  },
}
