import { ethers } from "ethers"
import { getProvider } from "utils/web3/provider"

export async function queryContractOwner(address: string) {
  const ownerAbi = [
    {
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ]

  const provider = getProvider()

  const collectionContract = new ethers.Contract(address, ownerAbi, provider)

  try {
    return await collectionContract.owner()
  } catch {
    return ""
  }
}

export async function queryERC721Owner({
  collectionAddress,
  tokenId,
  chainId,
}: {
  collectionAddress: string
  tokenId: number
  chainId?: number
}): Promise<string> {
  const ownerOfAbi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ]

  const provider = getProvider(chainId)

  const collectionContract = new ethers.Contract(
    collectionAddress,
    ownerOfAbi,
    provider
  )

  try {
    return await collectionContract.ownerOf(tokenId)
  } catch (err) {
    console.log("Failed queryERC721Owner: ", err)
    return ""
  }
}

export async function queryERC1155Balance({
  collectionAddress,
  ownerAddress,
  tokenId,
  chainId,
}: {
  collectionAddress: string
  ownerAddress: string
  tokenId: number
  chainId?: number
}): Promise<number> {
  const balanceOfAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ]

  const provider = getProvider(chainId)

  const collectionContract = new ethers.Contract(
    collectionAddress,
    balanceOfAbi,
    provider
  )

  try {
    return await collectionContract.balanceOf(ownerAddress, tokenId)
  } catch (err) {
    console.log("Failed queryERC1155Balance: ", err)
    return 0
  }
}
