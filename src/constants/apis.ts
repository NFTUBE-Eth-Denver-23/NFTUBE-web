import { Auth } from "aws-amplify"
import axios from "axios"

const backendAPIUrl = ` http://localhost:3001`

export const getBackendEndpoint = (endpoint: string) => {
  return `/${endpoint}?API_KEY=${process.env.NEXT_PUBLIC_NFTUBE_BACKENED_API_KEY}`
}

const MainBackendClient = axios.create({
  baseURL: backendAPIUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
})

//list of GET apis that need accesstoken attached to Params
const needsAccessToken = ["query_assets_by_nft_id", "query_collections"]
//list of POST apis that need appId injected
const needsAppId = [
  "update_asset",
  "save_assets",
  "create_assets_and_save_nfts",
  "update_nft",
  "save_collection",
  "save_user",
  "save_wallet",
]

MainBackendClient.interceptors.request.use(async (config: any) => {
  if (!config.data) {
    if (config.params && needsAccessToken.includes(config.url.split("/")[1])) {
      const session = await Auth.currentSession()
      const queryParams = JSON.parse(config.params.QUERY_PARAMS)
      queryParams.userId = session.getIdToken().payload.sub
      config.params.QUERY_PARAMS = JSON.stringify(queryParams)
      config.headers.Authorization = `Bearer ${session
        .getAccessToken()
        .getJwtToken()}`
    }
    return config
  } else {
    const session = await Auth.currentSession()
    // config.data.accessToken = session.getAccessToken().getJwtToken()
    config.headers.Authorization = `Bearer ${session
      .getAccessToken()
      .getJwtToken()}`
    config.data.userId = session.getIdToken().payload.sub
    if (needsAppId.includes(config.url.split("/")[1])) {
      config.data.appId = process.env.APP_ID
    }
    return config
  }
})

export { MainBackendClient }
