import React, { useEffect, useState } from "react"
import { MainNavbar } from "components/MainNavbar"
import { Spacing, Text } from "components/ui"
import { DefaultCollection } from "types/Collection"
import { queryCollection } from "api/collections"
import { Path } from "utils/url"
import { useMutation, useQuery } from "react-query"
import UploadAssets from "containers/create/upload"
import { NFT } from "types/NFT"
import { SwipeContainer } from "containers/create/SwipeContainer"
import { StepSection } from "components/StepSection"
import AddTraits from "containers/create/add-traits"
import { Toast } from "components/ui/Toast"
import { saveNFTsAndAssets } from "api/nfts"
import { useUser } from "hooks/useAuth"
import { useRouter } from "next/router"
import { signNFT } from "utils/web3/sign"
import { useWeb3React } from "@web3-react/core"
import ForceAuth from "containers/create/ForceAuth"
import { useLazyMintingOptionModal } from "containers/create/upload/lazyMintingModal"

export default function CreateNewNFTs() {
  const [editedCollection, setEditedCollection] = useState(DefaultCollection)
  const [editedNFTs, setEditedNFTs] = useState<Array<NFT>>([])
  const { account, chainId, library } = useWeb3React()
  const openLazyMintingModal = useLazyMintingOptionModal()
  const [step, setStep] = useState(0)
  const { user } = useUser()
  const { push } = useRouter()
  const id = Path.get("id")

  const { data: collectionData, isLoading: collectionLoading } = useQuery(
    id && ["query_collection_by_id", id],
    async () => {
      return await queryCollection(id)
    }
  )

  useEffect(() => {
    if (collectionData?.collectionId) {
      setEditedCollection(collectionData)
    }
  }, [collectionData])

  const { mutate, isLoading: saveLoading } = useMutation(
    ["create_nfts_and_save_assets"],
    async () =>
      await saveNFTsAndAssets({
        nfts: editedNFTs,
        userId: user.userId,
        skipMetadataUpload: true,
        assetCreatorAddress: account,
      }),
    {
      onSuccess: () => {
        Toast.success("NFTs created!")
        push(`/collection/${collectionData?.collectionId}`)
      },
      onError: (error) => {
        Toast.error("Could not create nfts. Please try again later.")
      },
    }
  )

  const validateData = () => {
    let totalAssetCount = 0
    for (var i = 0; i < editedNFTs.length; i++) {
      const nft = editedNFTs[i]
      totalAssetCount += nft.assets.length
    }

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
    try {
      const signature = await signNFT({
        library,
        maxTokenId,
        minPrice: mintPrice,
        maxSupply,
        chainId,
        contractAddress: editedCollection.address,
      })
      return signature
    } catch (e) {
      throw e
    }
  }

  const createNFTs = async () => {
    if (!validateData()) return

    mutate()
  }

  return (
    <ForceAuth>
      <MainNavbar />
      <Spacing height={20} />
      <React.Fragment>
        <StepSection
          steps={["1. Configure NFTs", "2. Configure Traits"]}
          step={step}
          setStep={setStep}
        />
        <SwipeContainer page={step}>
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
                    const maxTokenId = editedNFTs[editedNFTs.length - 1].tokenId
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

                    setStep(1)
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
            isLoading={collectionLoading || saveLoading}
            onClick={createNFTs}
          />
        </SwipeContainer>
      </React.Fragment>
    </ForceAuth>
  )
}
