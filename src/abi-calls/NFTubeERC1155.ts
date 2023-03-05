import { ASSET_FEE } from "constants/index"
import { ethers } from "ethers"
import NFTubeERC1155Abi from "src/abi/NFTubeERC1155.json"
import { getProvider } from "utils/web3/provider"

export async function queryCurrentSupply({
  collectionAddress,
  tokenId,
  chainId,
}: {
  collectionAddress: string
  tokenId: number
  chainId: number
}) {
  try {
    const nftContract = new ethers.Contract(
      collectionAddress,
      NFTubeERC1155Abi,
      getProvider(chainId)
    )

    const totalSupply = await nftContract.totalSupply(tokenId)

    return totalSupply.toNumber()
  } catch (err) {
    console.log("Failed queryCurrentSupply: ", err)
    throw Error(err)
  }
}

export async function queryBalanceOf({
  collectionAddress,
  tokenId,
  account,
  chainId,
}: {
  collectionAddress: string
  tokenId: number
  account: string
  chainId: number
}) {
  try {
    const nftContract = new ethers.Contract(
      collectionAddress,
      NFTubeERC1155Abi,
      getProvider(chainId)
    )

    const balance = await nftContract.balanceOf(account, tokenId)

    return balance.toNumber()
  } catch (err) {
    console.log("Failed queryCurrentSupply: ", err)
    throw Error(err)
  }
}

export async function mintBatchAndEncodeAssets({
  account,
  library,
  collectionAddress,
  tokenIds,
  amounts,
  assetCount,
}: {
  account: string
  library: any
  collectionAddress: string
  tokenIds: Array<number>
  amounts: Array<number>
  assetCount: number
}): Promise<void> {
  try {
    const nftContract = new ethers.Contract(
      collectionAddress,
      NFTubeERC1155Abi,
      library.getSigner()
    )

    const assetFee = ASSET_FEE * assetCount
    const mintBatchTransactionReceipt = await nftContract.mintBatch(
      account,
      tokenIds,
      amounts,
      { value: ethers.utils.parseEther(assetFee.toString()) }
    )
    const receipt = await mintBatchTransactionReceipt.wait()
    if (receipt.status == 0) throw Error("Transaction failed")
  } catch (err) {
    console.log("Failed mintNFT: ", err)
    throw Error(err)
  }
}

async function waitForRedeemTransaction(transactionReceipt: any) {
  const abi = [
    "event Redeemed(address _signer, address _redeemer, uint256 _tokenId, uint256 _price, uint256 _redeemFeeInPercentage, uint256 _assetFee);",
  ]
  const _interface = new ethers.utils.Interface(abi)
  // hash of Redeemed(address,address,uint256,uint256,uint256,uint256)
  const topic =
    "0x9098b5d2df18e362430218b79a4098cb0081120ca9fa44e94891dcbefe5204de"
  const receipt = await transactionReceipt.wait()
  const event = receipt.logs.find((log: any) => log.topics[0] === topic)
  return _interface.parseLog(event).args[2] // _tokenId
}

export async function redeemNFTAndEncodeAssets({
  account,
  library,
  collectionAddress,
  tokenId,
  //voucher info
  maxTokenId,
  maxSupply,
  minPrice,
  signature,
}: {
  account: string
  library: any
  collectionAddress: string
  tokenId: number
  maxTokenId: number
  maxSupply: number
  minPrice: number
  signature: string
}): Promise<void> {
  try {
    const etherValue = ethers.utils.parseEther(minPrice.toString())
    const nftVoucher = {
      maxTokenId,
      minPrice: etherValue,
      maxSupply,
      signature,
    }

    const nftContract = new ethers.Contract(
      collectionAddress,
      NFTubeERC1155Abi,
      library.getSigner()
    )

    const newERC1155Tx = await nftContract.redeem(
      account,
      tokenId,
      nftVoucher,
      { value: etherValue }
    )
    const _tokenId = await waitForRedeemTransaction(newERC1155Tx)
  } catch (err) {
    console.log("Failed mintNFT: ", err)
    throw Error(err)
  }
}
