import { v4 as uuidv4 } from "uuid"

export enum AssetType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  PRODUCT = "product",
}

export interface Asset {
  assetId?: string
  visibility?: boolean
  processed?: number
  nftId?: string
  creatorAddress?: string
  creatorId?: string
  assetURL?: string
  assetType?: AssetType
  ipfsHash?: string
}

export interface Product {
  productId?: string
  productName?: string
  productImage?: string
}

export const DefaultAsset = {
  assetId: uuidv4(),
  assetURL: "",
  assetType: AssetType.IMAGE,
  visibility: true,
  processed: 0,
  creatorAddress: "",
  creatorId: "",
}

export const DefaultProduct = {
  productId: uuidv4(),
  productName: "",
  productImage: "",
}
