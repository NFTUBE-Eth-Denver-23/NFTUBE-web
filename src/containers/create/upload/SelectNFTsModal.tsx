import styled from "@emotion/styled"
import { useCallback, useState } from "react"

import { useModal } from "hooks/useModal"
import { Input, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"
import { MoralisNFT, NFT } from "types/NFT"
import { useQuery } from "react-query"
import { useWeb3React } from "@web3-react/core"
import { getNFTsOnChain, queryNFTsByAddressesAndTokenIds } from "api/nfts"
import { NFTCard } from "components/card"
import { CardListContainer } from "components/CardListContainer"
import { Collection } from "types/Collection"
import { Toast } from "components/ui/Toast"

export function useSelectNFTsDialog() {
  const { open, close } = useModal()
  return useCallback(
    ({
      callback,
      editedNFTs,
      editedCollection,
    }: {
      callback: (selectedNFTs: Array<NFT>) => void
      editedNFTs: Array<NFT>
      editedCollection: Collection
    }) => {
      open(
        <SelectNFTsModal
          onClose={close}
          callback={callback}
          editedNFTs={editedNFTs}
          editedCollection={editedCollection}
        />
      )
    },
    [open]
  )
}

function SelectNFTsModal({
  onClose,
  callback,
  editedNFTs,
  editedCollection,
}: {
  onClose: () => void
  callback: (selectedNFTs: Array<NFT>) => void
  editedNFTs: Array<NFT>
  editedCollection: Collection
}) {
  const [selectedNFTs, setSelectedNFTs] = useState<Array<NFT>>([])
  const { account, chainId } = useWeb3React()

  const { data: onchainNFTs, isLoading: onChainNFTsLoading } = useQuery(
    account && ["query_owned_nfts_onchain", account, editedCollection.address],
    async () => {
      const data = await getNFTsOnChain({
        chainId,
        ownerAddress: account,
        tokenAddress: editedCollection.address,
      })
      return data
    }
  )

  const { data: nfts, isLoading: nftsLoading } = useQuery(
    onchainNFTs && [
      "query_nfts_by_collection_addresses_and_token_ids",
      onchainNFTs,
    ],
    async () => {
      const onChainNFTsFormatted = onchainNFTs.map((nft: MoralisNFT) => {
        return {
          collectionAddress: nft.token_address,
          tokenId: parseInt(nft.token_id),
        }
      })

      const data = await queryNFTsByAddressesAndTokenIds(onChainNFTsFormatted)

      const combinedNFTs = data.map((fetchedNFT: NFT, i: number): NFT => {
        const n: MoralisNFT = onchainNFTs[i]
        if (!fetchedNFT.collectionId) {
          return {
            imageURL: n.normalized_metadata.image,
            tokenId: parseInt(n.token_id),
            collectionAddress: n.token_address,
            ownerAddress: n.owner_of,
            name: `${n.name} #${n.token_id}`,
          }
        }
        return {
          ...fetchedNFT,
          imageURL: n.normalized_metadata.image,
        }
      })

      return combinedNFTs
    }
  )

  const isAlreadySelected = (tokenId: number) => {
    return (
      editedNFTs.filter((e) => e.tokenId == tokenId).length > 0 ||
      selectedNFTs.filter((e) => e.tokenId == tokenId).length > 0
    )
  }

  const removeSelectedNFT = (tokenId: number) => {
    return selectedNFTs.filter((e) => e.tokenId != tokenId)
  }

  return (
    <Container>
      <Text weight={700} size={25}>
        Select NFTs
      </Text>
      <Text weight={600} size={17} color={colors.gray2}>
        Select NFTs to make scannable
      </Text>
      <NFTContainer>
        <CardListContainer loading={nftsLoading || onChainNFTsLoading}>
          {nfts?.map((nft: NFT, i: number) => (
            <Center
              selected={nft.nftId || isAlreadySelected(nft.tokenId) ? 1 : 0}
              key={i}
              onClick={() => {
                if (nft.nftId) {
                  return Toast.error("This NFT has already been created")
                }
                if (isAlreadySelected(nft.tokenId)) {
                  const removedSelection = removeSelectedNFT(nft.tokenId)
                  setSelectedNFTs(removedSelection)
                } else {
                  setSelectedNFTs([...selectedNFTs, nft])
                }
              }}
            >
              <NFTCard
                hideHover
                data={nft}
                flag={nft.nftId ? "Created" : null}
                attributes={{
                  Address: nft.collectionAddress.slice(0, 10) + "..." || "-",
                }}
              />
            </Center>
          ))}
        </CardListContainer>
      </NFTContainer>
      <StyledButton
        onClick={() => {
          callback(selectedNFTs)
          onClose()
        }}
      >
        Add
      </StyledButton>
    </Container>
  )
}

const Container = styled.div`
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const NFTContainer = styled.div`
  overflow-y: auto;
  width: 100%;
`

const Center = styled.div<{ selected: number }>`
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(p) => (p.selected ? `2px solid ${colors.primary.color}` : "")};
  border-radius: 10px;
  &:hover {
    transform: ${(p) => (!p.selected ? "translateY(-2px)" : "")};
    transition: 200ms;
  }
`

const StyledButton = styled(Button)`
  max-width: 790px;
  height: 60px;
`
