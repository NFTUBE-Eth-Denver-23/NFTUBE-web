import styled from "@emotion/styled"
import { Divider, Spacing, Text } from "components/ui"
import AddCircleIcon from "components/icons/AddCircleIcon"
import { colors } from "constants/colors"
import Button from "components/ui/Buttons"
import NFTEditCard from "./NFTEditCard"
import { Collection } from "types/Collection"
import React, { useState } from "react"
import { DefaultNFT, NFT } from "types/NFT"
import { useUploaderDialog } from "components/Uploader"
import { useWeb3React } from "@web3-react/core"
import { v4 as uuidv4 } from "uuid"
import { useMounted } from "hooks/common"
import { useSelectNFTsDialog } from "./SelectNFTsModal"
import { OptionCard } from "../choose-option/OptionCard"
import AddIcon from "components/icons/AddIcon"
import { getChainTagById } from "constants/chains"
import { useQuery } from "react-query"
import { queryNFTCountInCollectionById } from "api/nfts"
import { Toast } from "components/ui/Toast"

export default function UploadAssets({
  editedCollection,
  editedNFTs,
  setEditedNFTs,
  mintNew,
  onClick,
  isLoading,
}: {
  editedCollection: Collection
  editedNFTs: Array<NFT>
  setEditedNFTs: (nfts: Array<NFT>) => void
  mintNew?: boolean
  onClick: () => void
  isLoading?: boolean
}) {
  const { account, library, chainId } = useWeb3React()
  const openUploader = useUploaderDialog()
  const openSelectNFTs = useSelectNFTsDialog()
  const mounted = useMounted()
  const [isAllURLValid, setIsAllURLValid] = useState<boolean>(true)

  const { data: collectionCount, isLoading: collectionCountLoading } = useQuery(
    editedCollection?.collectionId && [
      "query_nft_count_in_collection_by_id",
      editedCollection?.collectionId,
    ],
    async () => {
      return await queryNFTCountInCollectionById(editedCollection?.collectionId)
    }
  )

  if (!mounted) return null
  return (
    <Container>
      <Header>
        <TitleContainer>
          <Text weight={700} size={25}>
            {mintNew
              ? `Create NFTs for ${editedCollection?.name}`
              : `Create Assets for ${editedCollection?.name}`}
          </Text>
        </TitleContainer>
        <Spacing height={10} />
        {mintNew ? (
          <AddNewContainer
            onClick={() => {
              if (collectionCountLoading) return
              openUploader({
                multiple: true,
                callback: (urls) => {
                  let count = collectionCount
                  const newNFTs: Array<NFT> = []
                  urls.forEach((url) => {
                    const tokenId = editedNFTs?.length + count
                    const newNFT: NFT = {
                      ...DefaultNFT,
                      nftId: uuidv4(),
                      imageURL: url,
                      name: (editedCollection.name || "--") + ` #${tokenId}`,
                      ownerAddress: account,
                      creatorAddress: account,
                      collectionId: editedCollection?.collectionId,
                      collectionAddress: editedCollection?.address,
                      tokenId,
                      supply: editedNFTs.length > 0 ? editedNFTs[0].supply : 1,
                      chain: getChainTagById(chainId),
                    }
                    count++
                    newNFTs.push(newNFT)
                  })
                  setEditedNFTs([...editedNFTs, ...newNFTs])
                },
              })
            }}
          >
            {editedNFTs.length > 0 ? (
              <React.Fragment>
                <AddCircleIcon color={colors.gray1} width={28} height={28} />
                <Text weight={600} size={20} color={colors.gray1}>
                  Create New NFTs
                </Text>
              </React.Fragment>
            ) : (
              <div>
                <Spacing height={30} />
                <OptionCard
                  icon={<AddIcon color={colors.gray3} width={20} height={20} />}
                  checked={false}
                  title="Mint NFTs"
                  subtitle="Mint new scannable NFTs."
                  description="You can create NFTs backed by an assets such as a digital images."
                />
              </div>
            )}
          </AddNewContainer>
        ) : (
          <AddNewContainer
            onClick={() =>
              openSelectNFTs({
                callback: (selectedNFTs: Array<NFT>) => {
                  const standardizedNFTs = selectedNFTs.map((nft) => {
                    return {
                      ...DefaultNFT,
                      ...nft,
                      nftId: uuidv4(),
                      collectionId: editedCollection?.collectionId,
                    }
                  })

                  setEditedNFTs([...editedNFTs, ...standardizedNFTs])
                },
                editedNFTs,
                editedCollection,
              })
            }
          >
            {editedNFTs.length > 0 ? (
              <React.Fragment>
                <AddCircleIcon color={colors.gray1} width={28} height={28} />
                <Text weight={600} size={20} color={colors.gray1}>
                  Select NFTs
                </Text>
              </React.Fragment>
            ) : (
              <div>
                <Spacing height={30} />
                <OptionCard
                  icon={<AddIcon color={colors.gray3} width={20} height={20} />}
                  checked={false}
                  title="Choose NFTs"
                  subtitle="Select NFTs to make scannable."
                  description="NFTube will create invisible signatures on the NFTs you hold on-chain and register them on our smart contract."
                />
              </div>
            )}
          </AddNewContainer>
        )}
      </Header>
      <Scroll>
        {editedNFTs?.map((nft, index) => {
          return (
            <React.Fragment key={nft.nftId}>
              {/* <Divider height={1} color={colors.gray1} width="30px" /> */}
              <Spacing height={15} />
              <NFTEditCard
                collectionCount={collectionCount}
                mintNew={mintNew}
                editedCollection={editedCollection}
                nfts={editedNFTs}
                setNFTs={setEditedNFTs}
                index={index}
                urlValidationStateSetter={setIsAllURLValid}
              />
            </React.Fragment>
          )
        })}
      </Scroll>
      <Spacing height={20} />
      <StyledButton
        loading={isLoading}
        onClick={() => {
          if (isAllURLValid) {
            onClick()
          } else {
            Toast.error("Seems some url is not vaild format.")
          }
        }}
      >
        Next
      </StyledButton>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1248px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled.div`
  padding-bottom: 20px;
`

const Scroll = styled.div`
  height: 100%;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 7px;
`

const AddNewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const StyledButton = styled(Button)`
  max-width: 790px;
  width: 100%;
  margin-bottom: 30px;
`
