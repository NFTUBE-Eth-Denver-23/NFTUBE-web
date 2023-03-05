import { NFTCard } from "components/card"
import { CardListContainer } from "components/CardListContainer"
import styled from "@emotion/styled"
import { Spacing, Text } from "components/ui"
import { colors } from "constants/colors"
import AddIcon from "components/icons/AddIcon"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { useWeb3React } from "@web3-react/core"
import {
  getCollectionsOnChain,
  queryCollections,
  queryCollectionsByAddresses,
} from "src/api/collections"
import { Collection, CollectionType } from "types/Collection"
import { Toast } from "components/ui/Toast"

function fetchExternalCollections(account: string) {
  return useQuery(
    account && ["get_external_collections", account],
    async () => {
      const data = await getCollectionsOnChain(account, 1)

      const onlyERC721 = data.filter((nft) => {
        return nft.standard == "ERC721"
      })
      return onlyERC721
    }
  )
}

function fetchInternalCollections(account: string) {
  return useQuery(
    account && ["query_created_collections", account],
    async () => {
      const data = await queryCollections({
        isCreatedByUinc: true,
        creatorAddress: account,
        category: CollectionType.ALL,
      })
      return data
    }
  )
}

export default function ChooseCollection({ onClick, isNew }) {
  const { push } = useRouter()
  const { account } = useWeb3React()

  const { isLoading, data } = !isNew
    ? fetchExternalCollections(account)
    : fetchInternalCollections(account)

  const {
    isLoading: NFTubeFilteredCollectionsLoading,
    data: NFTubeFilteredCollections,
  } = useQuery(
    account &&
      data?.length && ["query_nftube_collections", account, data?.length],
    async () => {
      const NFTubeCollections = await queryCollectionsByAddresses(
        data.map((collection: Collection) => collection.address)
      )

      for (let i = 0; i < data.length; i++) {
        const fetchedCollection = data[i]
        data[i].ownerSignatureMintAllowed = true
        for (let j = 0; j < NFTubeCollections.length; j++) {
          const NFTubeCollection = NFTubeCollections[j]
          if (NFTubeCollection.address == fetchedCollection.address) {
            data[i].ownerSignatureMintAllowed =
              NFTubeCollection.ownerSignatureMintAllowed
          }
        }
      }

      return data
    }
  )

  return (
    <Container>
      <TitleContainer>
        <Text weight={700} size={25}>
          Select a collection
        </Text>
      </TitleContainer>
      <Scroll>
        <CardListContainer
          loading={isLoading || NFTubeFilteredCollectionsLoading}
        >
          <NewCollection
            onClick={() => {
              if (!isNew) {
                push("/create/new")
              } else {
                onClick()
              }
            }}
          />
          {NFTubeFilteredCollections
            ? NFTubeFilteredCollections.map((item, i) => {
                const disabled =
                  item.creatorAddress != account &&
                  !item.ownerSignatureMintAllowed
                return (
                  <Center
                    onClick={() => {
                      if (disabled) {
                        return Toast.error(
                          "You can not encode signatures on this collection"
                        )
                      }
                      onClick(item)
                    }}
                    key={i}
                  >
                    <NFTCard
                      disabled={disabled}
                      data={{
                        name: item?.name,
                        imageURL: item?.mainPhoto,
                        tokenId: 0,
                        collectionAddress: item?.address,
                        ownerAddress: account,
                      }}
                      attributes={{
                        Address: item?.address?.slice(0, 10) + "..." || "-",
                      }}
                    />
                  </Center>
                )
              })
            : null}
        </CardListContainer>
        <Spacing height={50} />
      </Scroll>
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
`

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
`

const Scroll = styled.div`
  height: 100%;
  flex: 1;
  overflow: auto;
`

const Center = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

function NewCollection({ onClick }: { onClick: () => void }) {
  return (
    <UploadContainer onClick={onClick}>
      <IconContainer>
        <AddIcon color={colors.gray2} width={30} height={30} />
        <Text color={colors.gray2} size={15} weight={700}>
          Create New
        </Text>
      </IconContainer>
    </UploadContainer>
  )
}

const UploadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 222px;
  height: 300px;
  border: 2px solid ${colors.gray4};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  & > div {
    border-radius: 10px !important;
  }
  transition: transform 300ms;
  &:hover {
    transform: translateY(-2px);
  }
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
