import { CollectionCard } from "components/card"
import { useSearchKeywords } from "components/filter-bar/useSearchKeywords"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import { collectionsMock } from "src/mock-data/collections"
import { commaizeNumber } from "utils/format"
import { useQuery } from "react-query"
import { queryCollections } from "api/collections"
import { Collection, CollectionType } from "types/Collection"

export default function CreatedList({
  address,
  userId,
}: {
  address: string
  userId?: string
}) {
  const { data: collections, isLoading: collectionsLoading } = useQuery(
    address && ["query_created_collections", address],
    async () => {
      const data = await queryCollections({
        isCreatedByUinc: true,
        creatorAddress: address,
        category: CollectionType.ALL,
        userId,
      })
      return data
    }
  )

  return (
    <CardListContainer
      loading={collectionsMock.isLoading}
      collection
      align={CardListAlignTypes.left}
    >
      {collections?.map((collection: Collection, i) => (
        <Center key={i}>
          <CollectionCard
            data={collection}
            attributes={{
              Standard: collection.standard,
              Scans: commaizeNumber(collection.scanCount || 0),
            }}
          />
        </Center>
      ))}
    </CardListContainer>
  )
}

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
