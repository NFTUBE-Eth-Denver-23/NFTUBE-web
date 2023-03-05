import { NFTCard } from "components/card"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import Link from "next/link"
import { queryUserLikedNFTs } from "api/nfts"
import { useQuery } from "react-query"
import { NFT } from "types/NFT"
import { useBrowsingChain } from "hooks/useBrowsingChain"

export default function FavoritedList({ userId }: { userId: string }) {
  const { browsingChainId } = useBrowsingChain()
  const { data: nfts, isLoading: nftsLoading } = useQuery(
    userId && ["query_user_liked_nfts", userId],
    async () => {
      const data = await queryUserLikedNFTs({
        userId,
        chainId: browsingChainId,
      })
      return data
    }
  )

  return (
    <CardListContainer loading={nftsLoading} align={CardListAlignTypes.left}>
      {nfts?.map((nft: NFT, i: number) => (
        <Center key={i}>
          <Link href={`/nft/${nft.nftId}`} passHref>
            <NFTCard
              data={nft}
              attributes={{
                Creator: nft.creatorAddress
                  ? nft.creatorAddress.slice(0, 10) + "..." || "-"
                  : "--",
              }}
            />
          </Link>
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
