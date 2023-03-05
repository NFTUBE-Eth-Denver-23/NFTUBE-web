import axios from "axios"
import { getBackendEndpoint, MainBackendClient } from "constants/apis"
import { Asset } from "types/Asset"

export async function queryExternalImgMetadata(endpoint: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`fetch_external_img_metadata/?ENDPOINT=${endpoint}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryExternalImgMetadata: ", err)
    // throw Error()
  }
}

export async function createPresignedURL({
  userId,
  assets,
}: {
  userId: string
  assets: Array<Asset>
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint("create_pre_signed_url"),
      {
        data: {
          userId,
          assets,
        },
      }
    )

    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed createPresignedURL: ", err)
    throw Error()
  }
}
