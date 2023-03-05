import { getBackendEndpoint, MainBackendClient } from "constants/apis"
import { getChain, getChainTagById } from "constants/chains"
import { NFT } from "types/NFT"

export async function queryNFTsByCollectionId(collectionId: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_nfts_by_collection_id/${collectionId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryNFTsByCollectionId: ", err)
    throw Error()
  }
}

export async function queryNFTById(nftId: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_nft/${nftId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryNFTById: ", err)
    throw Error()
  }
}

export async function queryNFTsByAddressesAndTokenIds(
  params: Array<{
    collectionAddress: string
    tokenId: number
  }>
) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_nfts_by_collection_addresses_and_token_ids`),
      {
        params: {
          QUERY_PARAMS: JSON.stringify({
            addressesAndTokenIds: params,
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
    console.log("failed queryNFTsByAddressesAndTokenIds: ", err)
    throw Error()
  }
}

export async function queryNFTCountInCollectionById(collectionId: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_nft_count_in_collection_by_id/${collectionId}`)
    )
    if (data.success) {
      //TODO: change this once new api deployed
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryNFTCountInCollectionById: ", err)
    throw Error()
  }
}

export const getNFTsOnChain = async ({
  chainId,
  ownerAddress,
  tokenAddress,
  cursor,
}: {
  chainId: number
  ownerAddress: string
  tokenAddress?: string
  cursor?: string
}) => {
  const chainTag = getChain(chainId).chainTag

  let { data: nftData } = await MainBackendClient.get(
    `https://deep-index.moralis.io/api/v2/${ownerAddress}/nft`,
    {
      params: {
        chain: chainTag,
        token_addresses: tokenAddress,
        normalizeMetadata: true,
        cursor,
      },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      },
    }
  )
  return nftData.result
}

export const queryNFTUserRelation = async ({
  nftId,
  userId,
}: {
  nftId: string
  userId: string
}) => {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_nft_user_relation/${nftId}/${userId}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryNFTUserRelation: ", err)
    throw Error()
  }
}

export const queryUserLikedNFTs = async ({
  userId,
  chainId,
}: {
  userId: string
  chainId: number
}) => {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_user_liked_nfts/${userId}/${chainId}`),
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
    console.log("failed queryUserLikedNFTs: ", err)
  }
}

export async function saveNFTsAndAssets({
  nfts,
  skipMetadataUpload,
  assetCreatorAddress,
  userId,
}: {
  nfts: Array<NFT>
  userId: string
  skipMetadataUpload: boolean
  assetCreatorAddress: string
}) {
  try {
    const formattedNFTs = nfts.map((nft) => {
      let nftData = { ...nft }
      delete nftData.assets
      delete nftData.traits
      return {
        nftData,
        assets: nft.assets,
        traits: nft.traits,
        assetCreatorAddress,
        assetCreatorId: userId,
        skipMetadataUpload,
      }
    })

    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`create_assets_and_save_nfts`),
      {
        data: formattedNFTs,
      }
    )

    return data
  } catch (err) {
    console.log("failed saveNFTsAndAssets: ", err)
    throw Error(err)
  }
}

export async function updateNFT({
  nftId,
  name,
  description,
  marketplaceURL,
}: {
  nftId: string
  name: string
  description: string
  marketplaceURL: string
}) {
  try {
    const { data } = await MainBackendClient.put(
      getBackendEndpoint(`update_nft/${nftId}`),
      {
        data: {
          name,
          description,
          marketplaceURL,
        },
      }
    )

    return data
  } catch (err) {
    console.log("failed updateNFT: ", err)
    throw Error(err)
  }
}

export async function likeNFT({
  nftId,
  userId,
}: {
  nftId: string
  userId: string
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`like_nft/${nftId}/${userId}`),
      {
        userId,
      }
    )

    return data
  } catch (err) {
    console.log("failed likeNFT: ", err)
    throw Error(err)
  }
}

export async function unlikeNFT({
  nftId,
  userId,
}: {
  nftId: string
  userId: string
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`unlike_nft/${nftId}/${userId}`),
      {}
    )

    return data
  } catch (err) {
    console.log("failed unlikeNFT: ", err)
    throw Error(err)
  }
}

export async function incrementNFTViewCount({ nftId }: { nftId: string }) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`increment_nft_view_count/${nftId}`),
      {}
    )

    return data
  } catch (err) {
    console.log("failed incrementNFTViewCount: ", err)
    throw Error(err)
  }
}
