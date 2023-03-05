import { SocialLinks } from "./SocialLinks"
import { v4 as uuidv4 } from "uuid"

export enum CollectionStatus {
  Draft = "draft",
  Live = "live",
}

export enum CollectionType {
  ALL = "all",
  ART = "art",
  FASHION = "fashion",
  DIGITAL = "digital",
  CELEBRITY = "celebrity",
  GAME = "game",
  BRANDS = "brands",
  COLLECTIBLES = "collectibles",
  SPORTS = "sports",
  MUSIC = "music",
}

export interface Collection {
  collectionId?: string
  address?: string
  isCreatedByNFTube?: boolean
  creatorAddress?: string
  name?: string
  description?: string
  coverPhoto?: string
  mainPhoto?: string
  marketplace?: string
  category?: CollectionType
  chain?: string
  standard?: string
  isListed?: boolean
  status?: CollectionStatus | string
  socialLinks?: SocialLinks
  shippingRequired?: boolean
  ownerSignatureMintAllowed?: boolean

  //not in DB
  imageURL?: string
  scanCount?: number
  viewCount?: number
}

export interface CollectionUserRelation {
  isLiked: boolean
}

export const DefaultCollection: Collection = {
  collectionId: uuidv4(),
  address: "",
  isCreatedByNFTube: true,
  creatorAddress: "",
  name: "",
  description: "",
  coverPhoto: "",
  mainPhoto: "",
  category: CollectionType.ALL,
  chain: "",
  standard: "ERC1155",
  isListed: true,
  status: CollectionStatus.Live,
  shippingRequired: false,
  ownerSignatureMintAllowed: true,
}
