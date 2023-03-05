import { DEFAULT_CHAIN_ID, getChain } from "constants/index"
import { ExternalProvider } from "@ethersproject/providers"
import { Chain } from "constants/chains"
import { Toast } from "components/ui/Toast"

const defaultChain = getChain(DEFAULT_CHAIN_ID)

async function addTokenToMetamask(
  type: string,
  address: string,
  symbol: string,
  decimals: number,
  image?: string
) {
  await window["ethereum"].request({
    method: "wallet_watchAsset",
    params: {
      type, // Initially only supports ERC20, but eventually more!
      options: {
        address: address, // The address that the token is at.
        symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: decimals, // The number of decimals in the token
        image: image, // A string url of the token logo
      },
    },
  })
}

async function switchToDefaultChain() {
  try {
    const formattedChainId = `0x${defaultChain.chainId.toString(16)}`
    await window["ethereum"].request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: formattedChainId }],
    })
  } catch (error) {
    if (error.code === 4902 || error.code === -32603) {
      await addChain(`0x${defaultChain.chainId.toString(16)}`)
    }
  }
}

async function switchToChain(chainId: number) {
  let formattedChainId: string | null = null
  try {
    formattedChainId = `0x${chainId.toString(16)}`
    const res = await window["ethereum"].request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: formattedChainId }],
    })
  } catch (error) {
    if (error.code === 4902 || error.code === -32603) {
      const fromSwitchChain = true
      await addChain(formattedChainId, fromSwitchChain)
    }
  }
}

export async function switchChain(
  provider: ExternalProvider,
  chainId: number,
  chainInfo: Chain
) {
  const formattedChainId = `0x${chainId.toString(16)}`
  try {
    return await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: formattedChainId }],
    })
  } catch (switchError) {
    if (switchError.code == 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: formattedChainId,
              chainName: chainInfo.chainName,
              rpcUrls: chainInfo.rpcUrls,
              nativeCurrency: chainInfo.nativeCurrency,
              blockExplorerUrls: chainInfo.blockExplorerUrls,
            },
          ],
        })
      } catch (addError) {}
    }
    return switchError
  }
}

async function addChain(chain, unSupportChainNotification = false) {
  try {
    await window["ethereum"].request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...chain,
        },
      ],
    })
  } catch (addError) {
    if (unSupportChainNotification) {
      Toast.error("Current network is not supported from selected chain.")
    }
    console.error(addError)
  }
}

export { addTokenToMetamask, switchToDefaultChain, switchToChain, addChain }
