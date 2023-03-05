import axios from "axios"
import { getBackendEndpoint, MainBackendClient } from "constants/apis"
import { getChainTagById } from "constants/chains"
import { Collection, CollectionType } from "types/Collection"
import { ipfsToHttp } from "utils/url"

export async function queryCollection(collectionId: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_collection/${collectionId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollection: ", err.message)
    throw Error()
  }
}

interface CollectionsQueryParams {
  isCreatedByUinc?: boolean
  category?: CollectionType
  creatorAddress?: string
  filterTest?: boolean
  chain?: string
  filterTestOverride?: boolean
  //for query hidden collections
  userId?: string
}

export async function queryCollections(params: CollectionsQueryParams) {
  try {
    params.category = params.category || CollectionType.ALL
    params.filterTest = true
    params.filterTestOverride = true

    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_collections`),
      {
        params: {
          QUERY_PARAMS: JSON.stringify(params),
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollections: ", err)
    throw Error()
  }
}

export async function queryCollectionsByAddresses(params: Array<string>) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_collections_by_addresses`),
      {
        params: {
          QUERY_PARAMS: JSON.stringify({
            addresses: params,
          }),
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollectionsByAddresses: ", err)
    throw Error()
  }
}
export async function queryCollectionScanAndViewCount(collectionId: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_collection_scan_and_view_count/${collectionId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollectionScanAndViewCount: ", err)
    throw Error()
  }
}

export const getCollectionsOnChain = async (
  address: string,
  chainId: number
) => {
  const chainTag = getChainTagById(chainId)
  const { data } = await MainBackendClient.get(
    `https://deep-index.moralis.io/api/v2/${address}/nft/collections`,
    {
      params: { chain: chainTag },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      },
    }
  )

  const collectionsInfo = await Promise.all(
    data.result.map(async (d: any) => {
      let { data: nftData } = await MainBackendClient.get(
        `https://deep-index.moralis.io/api/v2/${address}/nft`,
        {
          params: {
            chain: chainTag,
            limit: 1,
            token_addresses: d.token_address,
            normalizeMetadata: true,
          },
          headers: {
            accept: "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
          },
        }
      )
      const singleNFT = nftData.result[0]
      return {
        mainPhoto: ipfsToHttp(singleNFT.normalized_metadata.image),
        name: singleNFT.name,
        symbol: singleNFT.symbol,
        collectionId: singleNFT.token_address,
        address: singleNFT.token_address,
        standard: singleNFT.contract_type,
      }
    })
  )

  return collectionsInfo
}

export const queryCollectionUserRelation = async ({
  collectionId,
  userId,
}: {
  collectionId: string
  userId: string
}) => {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(
        `query_collection_user_relation/${collectionId}/${userId}`
      )
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryCollectionUserRelation: ", err)
    throw Error()
  }
}

export const queryUserLikedCollections = async ({
  userId,
  chainId,
}: {
  userId: string
  chainId?: number
}) => {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_user_liked_collections/${userId}`),
      {
        params: {
          chain: getChainTagById(chainId),
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryUserLikedCollections: ", err)
  }
}

interface SearchCollectionParams {
  keyword: string
  category?: CollectionType
  chain?: string
  filterTestOverride?: boolean
}

export async function searchCollections(params: SearchCollectionParams) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`search_collections`),
      {
        params: {
          QUERY_PARAMS: JSON.stringify(params),
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryUserLikedCollections: ", err)
  }
}

export async function saveCollection({
  collection,
}: {
  collection: Collection
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint("save_collection"),
      {
        data: collection,
      }
    )

    if (data.success) {
      return data.message
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed saveCollection: ", err)
    throw Error()
  }
}

export async function likeCollection({
  collectionId,
  userId,
}: {
  collectionId: string
  userId: string
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`like_collection/${collectionId}/${userId}`),
      {}
    )

    return data
  } catch (err) {
    console.log("failed likeCollection: ", err)
    throw Error(err)
  }
}

export async function unlikeCollection({
  collectionId,
  userId,
}: {
  collectionId: string
  userId: string
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`unlike_collection/${collectionId}/${userId}`),
      {}
    )

    return data
  } catch (err) {
    console.log("failed unlikeCollection: ", err)
    throw Error(err)
  }
}
