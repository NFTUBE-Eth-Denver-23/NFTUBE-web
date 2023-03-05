import axios from "axios"
import { getBackendEndpoint, MainBackendClient } from "constants/apis"
import { User } from "types/User"

export async function queryUserByAddress({
  address,
  chain,
}: {
  address: string
  chain: string
}) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_user_by_wallet_address/${address}/${chain}`)
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed queryUserByAddress: ", err)
    throw Error()
  }
}

export async function queryUserById(userId: string) {
  try {
    const { data } = await MainBackendClient.get(
      getBackendEndpoint(`query_user/${userId}`)
    )
    if (data.success) {
      data.data.socialLinks = JSON.parse(data.data.socialLinks)
      return data.data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryUserById: ", err)
    throw Error()
  }
}

export async function queryUserByTag(tag: string) {
  try {
    const {
      data: { data, success },
    } = await MainBackendClient.get(
      getBackendEndpoint(`query_user_by_tag/${tag}`)
    )
    if (success) {
      if (data.socialLinks) {
        data.socialLinks = JSON.parse(data.socialLinks)
      }
      return data
    } else {
      throw Error("server message error")
    }
  } catch (err) {
    console.log("failed queryUserById: ", err)
    throw Error()
  }
}

export async function saveUser({ user }: { user: User }) {
  try {
    const { data } = await MainBackendClient.post(
      getBackendEndpoint("save_user"),
      {
        data: user,
      }
    )
    if (data.success) {
      return data.data
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    console.log("failed saveUser: ", err)
    throw Error()
  }
}
