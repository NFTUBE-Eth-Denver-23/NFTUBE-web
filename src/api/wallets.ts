import { getBackendEndpoint, MainBackendClient } from "constants/apis"
import { getChain } from "constants/chains"

export async function queryWalletsByUserIdAndChain({
  userId,
  chainId,
}: {
  userId: string
  chainId: number
}) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(
        `query_wallets_by_user_id_and_chain/${userId}/${
          getChain(chainId).chainTag
        }`
      )
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryWalletsByUserIdAndChain: ", err)
    throw Error()
  }
}

export async function queryWalletByUserIdAndChain({
  userId,
  chainId,
}: {
  userId: string
  chainId: number
}) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(
        `query_recent_wallet_by_user_id_and_chain/${userId}/${
          getChain(chainId).chainTag
        }`
      )
    )

    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryWalletByUserIdAndChain: ", err)
    throw Error()
  }
}

export async function saveWallet({
  address,
  chainId,
  userId,
  signature,
}: {
  address: string
  chainId: number
  userId: string
  signature: string
}) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint("save_wallet"),
      {
        data: {
          address,
          chain: getChain(chainId).chainTag,
          chainId,
          userId,
          signature,
        },
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed saveWallet: ", err)
    throw Error()
  }
}
