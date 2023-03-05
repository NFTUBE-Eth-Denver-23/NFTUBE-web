import { CollectionCard } from "components/card"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import { useQuery } from "react-query"
import { queryUserLikedCollections } from "api/collections"
import { Collection } from "types/Collection"
import { useBrowsingChain } from "hooks/useBrowsingChain"

export default function WatchList({ userId }: { userId: string }) {
  const { browsingChainId } = useBrowsingChain()
  const { data: collections, isLoading: collectionsLoading } = useQuery(
    userId && ["query_user_liked_collections", userId],
    async () => {
      const data = await queryUserLikedCollections({
        userId,
        chainId: browsingChainId,
      })
      return data
    }
  )

  return (
    <CardListContainer
      loading={collectionsLoading}
      collection
      align={CardListAlignTypes.left}
    >
      {collections?.map((collection: Collection, i: number) => (
        <Center key={i}>
          <CollectionCard data={collection} />
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
