import { CollectionCard } from "components/card"
import { useSearchKeywords } from "components/filter-bar/useSearchKeywords"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import { useQuery } from "react-query"
import { queryCollections, searchCollections } from "src/api/collections"
import { Collection, CollectionType } from "types/Collection"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { getChainTagById } from "constants/chains"

export default function CollectionList({ tab }: { tab: string }) {
  const keywords = useSearchKeywords()
  const { browsingChainId } = useBrowsingChain()
  const { isLoading, data } = useQuery(
    tab && [`get_all_${tab}_collections`, tab, keywords],
    async () => {
      const isProduction = process.env.NODE_ENV == "production"
      if (keywords.value && keywords.value.length > 0) {
        return await searchCollections({
          keyword: keywords.value[0],
          category: tab as CollectionType,
          chain: isProduction ? getChainTagById(browsingChainId) : undefined,
        })
      } else {
        return await queryCollections({
          category: tab as CollectionType,
          chain: isProduction ? getChainTagById(browsingChainId) : undefined,
        })
      }
    }
  )

  return (
    <CardListContainer
      align={CardListAlignTypes.left}
      loading={isLoading}
      collection
    >
      {data?.map((collection: Collection, i) => (
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
