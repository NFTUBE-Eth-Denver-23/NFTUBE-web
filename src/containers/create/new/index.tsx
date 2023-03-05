import React, { useState } from "react"
import styled from "@emotion/styled"

import { SwipeContainer } from "../SwipeContainer"
import { StepSection } from "components/StepSection"

import { MainNavbar } from "components/MainNavbar"
import ChooseCollection from "../choose-collection"
import ConfigureCollection from "../ConfigureCollection"
import UploadAssets from "../upload"
import AddTraits from "../add-traits"
import ForceAuth from "../ForceAuth"
import { Collection, DefaultCollection } from "types/Collection"
import { saveCollection } from "src/api/collections"
import { v4 as uuidv4 } from "uuid"
import { NFT } from "types/NFT"
import { useMutation } from "react-query"
import { Toast } from "components/ui/Toast"
import { saveNFTsAndAssets } from "src/api/nfts"
import { useWeb3React } from "@web3-react/core"
import { getChain } from "constants/chains"
import { useRouter } from "next/router"
import { signNFT } from "utils/web3/sign"
import { useLazyMintingOptionModal } from "../upload/lazyMintingModal"
import { useMounted } from "hooks/common"
import { deployCollectionContract } from "src/abi-calls/NFTubeManager"
import { mintBatchAndEncodeAssets } from "src/abi-calls/NFTubeERC1155"

export default function CreateNew() {
  const isMounted = useMounted()
  const [step, setStep] = useState(0)
  const { account, chainId, library } = useWeb3React()
  const [editedCollection, setEditedCollection] = useState<Collection>(
    DefaultCollection
  )
  const [editedNFTs, setEditedNFTs] = useState<Array<NFT>>([])
  const { push } = useRouter()
  const openLazyMintingModal = useLazyMintingOptionModal()

  const { mutate, isLoading } = useMutation(
    ["create_nfts_and_save_assets"],
    async () => {
      if (editedNFTs[0].isMinted) {
        await mintBatchAndEncodeAssets({
          account,
          library,
          collectionAddress: editedCollection.address,
          tokenIds: editedNFTs.map((nft) => nft.tokenId),
          amounts: editedNFTs.map((nft) => nft.supply),
          assetCount: editedNFTs.reduce(
            (sum, obj) => sum + obj.assets.length,
            0
          ),
        })
      }

      await saveNFTsAndAssets({
        nfts: editedNFTs,
        userId: "06bd2e5f-9ca8-4695-a641-90e98b402a75",
        skipMetadataUpload: false,
        assetCreatorAddress: account,
      })
    },
    {
      onSuccess: () => {
        Toast.success("NFTs created!")
        push("/explore")
      },
      onError: (error) => {
        Toast.error("Could not create nfts. Please try again later.")
      },
    }
  )

  const validateData = () => {
    const totalAssetCount = editedNFTs.reduce(
      (sum, obj) => sum + obj.assets.length,
      0
    )

    if (totalAssetCount + editedNFTs.length > 100) {
      Toast.error("You can only mint up to 100 invisible signatures at once")
      return false
    }

    return true
  }

  const implementSignature = async ({
    mintPrice,
    maxTokenId,
    maxSupply,
  }: {
    mintPrice: number
    maxTokenId: number
    maxSupply: number
  }) => {
    const signature = await signNFT({
      library,
      maxTokenId,
      minPrice: mintPrice,
      maxSupply,
      chainId,
      contractAddress: editedCollection.address,
    })

    return signature
  }

  const createNFTs = async () => {
    if (!validateData()) return

    mutate()
  }

  if (!isMounted) return null
  return (
    <ForceAuth>
      <Container>
        <MainNavbar />
        <React.Fragment>
          <StepSection
            steps={[
              "1. Choose a collection",
              "2. Configure the collection",
              "3. Create NFTs",
              "4. Configure properties",
            ]}
            step={step}
            setStep={setStep}
          />
          <SwipeContainer page={step}>
            <ChooseCollection
              isNew={true}
              onClick={async (collection?: Collection) => {
                if (!collection) {
                  setStep(1)
                } else {
                  setEditedCollection(collection)
                  setStep(2)
                }
              }}
            />
            <ConfigureCollection
              isNew
              editedCollection={editedCollection}
              setEditedCollection={setEditedCollection}
              onClick={async (editedCollection: Collection) => {
                const collectionId = uuidv4()
                const newERC1155Address = await deployCollectionContract({
                  account,
                  library,
                  chainId,
                  collectionId,
                  ownerSignatureMintAllowed:
                    editedCollection.ownerSignatureMintAllowed,
                })

                const newCollection = {
                  ...editedCollection,
                  creatorAddress: account,
                  chain: getChain(chainId).chainTag,
                  address: newERC1155Address,
                  collectionId: collectionId,
                }
                setEditedCollection(newCollection)
                await saveCollection({
                  collection: newCollection,
                })
              }}
              onSuccess={() => setStep(2)}
            />
            <UploadAssets
              editedCollection={editedCollection}
              editedNFTs={editedNFTs}
              setEditedNFTs={setEditedNFTs}
              onClick={async () => {
                if (editedNFTs.length == 0) {
                  return Toast.error("Please create at least 1 NFT")
                }

                openLazyMintingModal({
                  callback: async ({
                    mintPrice,
                    isMinted,
                    isNFTImageScannable,
                  }) => {
                    try {
                      const maxTokenId =
                        editedNFTs[editedNFTs.length - 1].tokenId
                      let signature = undefined
                      if (!isMinted) {
                        signature = await implementSignature({
                          maxTokenId,
                          mintPrice,
                          maxSupply: editedNFTs[editedNFTs.length - 1].supply,
                        })
                      }

                      const newNFTs = editedNFTs.map((nft) => {
                        let newNFT = { ...nft }
                        if (signature) {
                          newNFT.signature = signature
                        }
                        newNFT.mintPrice = mintPrice
                        newNFT.isMinted = isMinted
                        newNFT.isNFTImageScannable = isNFTImageScannable
                        newNFT.maxTokenId = maxTokenId
                        return newNFT
                      })
                      setEditedNFTs(newNFTs)
                      setStep(3)
                    } catch (err) {
                      Toast.error("Could not sign. Please try again later")
                    }
                  },
                })
              }}
              mintNew
            />
            <AddTraits
              editedNFTs={editedNFTs}
              setEditedNFTs={setEditedNFTs}
              isLoading={isLoading}
              onClick={createNFTs}
            />
          </SwipeContainer>
        </React.Fragment>
      </Container>
    </ForceAuth>
  )
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`
