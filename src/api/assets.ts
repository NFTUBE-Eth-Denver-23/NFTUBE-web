import { getBackendEndpoint, MainBackendClient } from "constants/apis"
import { Asset } from "types/Asset"

export async function queryAssetsByNFTId(
  nftId: string,
  params: { userId: string; creatorAddress: string; walletAddress: string }
) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_assets_by_nft_id/${nftId}`),
      {
        params: {
          QUERY_PARAMS: JSON.stringify(params),
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryAssetsByNFTId: ", err)
    throw Error()
  }
}

export async function updateAsset({
  assetId,
  visibility,
}: {
  assetId: string
  visibility: boolean
}) {
  try {
    const { data } = await MainBackendClient.put(
      getBackendEndpoint(`update_asset/${assetId}`),
      {
        data: {
          visibility,
        },
      }
    )

    if (!data.success) {
      throw Error(data.message)
    }

    return data
  } catch (err) {
    console.log("failed updateAsset: ", err)
    throw Error(err)
  }
}

export async function createAssets({
  nftId,
  assetCreatorAddress,
  assets,
  userId,
}: {
  nftId: string
  assetCreatorAddress: string
  assets: Array<Asset>
  userId: string
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint(`save_assets`),
      {
        data: {
          nftId,
          assetCreatorAddress,
          assetCreatorId: userId,
          assets,
        },
      }
    )

    if (!data.success) {
      throw Error(data.message)
    }

    return data
  } catch (err) {
    console.log("failed updateAsset: ", err)
    throw Error(err)
  }
}
