import { addresses } from "constants/addresses"
import { ASSET_FEE } from "constants/index"
import { ethers } from "ethers"
import NFTubeManagerAbi from "src/abi/NFTubeManager.json"
declare global {
  interface Window {
    ethereum: any
  }
}
export async function getNFTubeERC1155AddressFromDeployERC1155Event(
  transactionReceipt: any
) {
  const abi = [
    "event ERC1155Deployed(address _contract, address _creator, string _uri, bool _ownerSignatureMintAllowed);",
  ]
  const _interface = new ethers.utils.Interface(abi)

  // topic = keccak256 hash of ERC1155Deployed(address,address,string,bool)
  const topic =
    "0x5a32928ff1d139c36048a90ae64f9daeda8c7f98f783663252aedab8e64e6ab0"

  const receipt = await transactionReceipt.wait()

  if (receipt.status === 0) {
    throw Error("Transaction failed")
  }

  const event = receipt.logs.find((log: any) => {
    if (log.topics[0] === topic) {
      return log
    }
  })
  return _interface.parseLog(event).args[0]
}

export async function deployCollectionContract({
  account,
  library,
  chainId,
  collectionId,
  ownerSignatureMintAllowed,
}: {
  account: string
  library: any
  chainId: number
  collectionId: string
  ownerSignatureMintAllowed: boolean
}) {
  const NFTubeManagerContract = new ethers.Contract(
    addresses[chainId].NFTUBE_MANAGER_ADDRESS,
    NFTubeManagerAbi,
    library.getSigner()
  )

  //deploy collection with 2.5% royalty
  const deployERC1155Tx = await NFTubeManagerContract.deployERC1155(
    `s3://nftube-collections/${account}/${collectionId}/{id}.json`,
    ownerSignatureMintAllowed
  )

  const res = await getNFTubeERC1155AddressFromDeployERC1155Event(
    deployERC1155Tx
  )
  return res
}

export async function sendFee({
  chainId,
  library,
  assetCount,
}: {
  chainId: number
  library: any
  assetCount: number
}) {
  if (ASSET_FEE <= 0) return

  const NFTubeManagerContract = new ethers.Contract(
    addresses[chainId].NFTUBE_MANAGER_ADDRESS,
    NFTubeManagerAbi,
    library.getSigner()
  )

  const assetFee = ASSET_FEE * assetCount
  const receiveFeeTx = await NFTubeManagerContract.receiveFee({
    value: assetFee,
  })
  const receipt = await receiveFeeTx.wait()
  if (receipt.status == 0) throw Error("Transaction failed")
}
