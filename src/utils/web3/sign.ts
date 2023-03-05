import { ethers } from "ethers"

export async function signNFT({
  library,
  maxTokenId,
  minPrice,
  maxSupply,
  chainId,
  contractAddress,
}: {
  library: any
  maxTokenId: number
  minPrice: number
  maxSupply: number
  chainId: number
  contractAddress: string
}) {
  try {
    const SIGNING_DOMAIN = "NFTube-Voucher"
    const SIGNATURE_VERSION = "1"

    const signer = library.getSigner()

    const domain = {
      name: SIGNING_DOMAIN,
      version: SIGNATURE_VERSION,
      chainId,
      verifyingContract: contractAddress,
    }

    const mintPriceInBigNumber = ethers.utils.parseEther(minPrice.toString())

    const types = {
      NFTVoucher: [
        { name: "maxTokenId", type: "uint256" },
        { name: "minPrice", type: "uint256" },
        { name: "maxSupply", type: "uint256" },
      ],
    }

    const voucher = {
      maxTokenId,
      minPrice: mintPriceInBigNumber,
      maxSupply,
    }
    const signature = await signer._signTypedData(domain, types, voucher)

    return signature
  } catch (err) {
    throw err
  }
}

export async function signWallet({ library, chainId, userId }) {
  const SIGNING_DOMAIN = "NFTube-Wallet"
  const SIGNATURE_VERSION = "1"

  const signer = library.getSigner()

  const domain = {
    name: SIGNING_DOMAIN,
    version: SIGNATURE_VERSION,
    chainId,
  }

  const types = {
    identity: [{ name: "userId", type: "string" }],
  }

  const identity = {
    userId,
  }

  try {
    const signature = await signer._signTypedData(domain, types, identity)
    return signature
  } catch (err) {
    console.log("sign failed:", err)
  }
}
