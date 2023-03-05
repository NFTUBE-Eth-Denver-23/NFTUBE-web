import { NFTCard } from "components/card"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import { nftsMock } from "src/mock-data/nfts"
import Link from "next/link"
import { NFT } from "types/NFT"

export default function NFTList({
  nfts,
  isLoading,
}: {
  nfts: Array<NFT>
  isLoading: boolean
}) {
  return (
    <CardListContainer align={CardListAlignTypes.left} loading={isLoading}>
      {nfts?.map((nft, i) => (
        <Link key={i} href={`/nft/${nft.nftId}`} passHref>
          <Center key={i}>
            <NFTCard
              data={nft}
              attributes={{
                Owner: nft?.ownerAddress?.slice(0, 5) + "..." || "-",
              }}
            />
          </Center>
        </Link>
      ))}
    </CardListContainer>
  )
}

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
