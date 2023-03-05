import { NFTCard } from "components/card"
import {
  CardListAlignTypes,
  CardListContainer,
} from "components/CardListContainer"
import styled from "@emotion/styled"
import { useQuery } from "react-query"
import { getNFTsOnChain, queryNFTsByAddressesAndTokenIds } from "api/nfts"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { MoralisNFT, NFT } from "types/NFT"
import { useRouter } from "next/router"

export default function OwnedList({ address }: { address: string }) {
  const { browsingChainId } = useBrowsingChain()
  const { push } = useRouter()

  const fetchEnabled = !!address
  const { data: onchainNFTs, isLoading } = useQuery(
    address && ["query_owned_nfts_onchain", address],
    async () => {
      const data = await getNFTsOnChain({
        chainId: browsingChainId,
        ownerAddress: address,
      })
      return data
    },
    { enabled: fetchEnabled }
  )

  const onChainNFTsLoading = fetchEnabled && isLoading

  const { data: nfts } = useQuery(
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
    },
    { enabled: !!onchainNFTs }
  )

  return (
    <CardListContainer
      loading={onChainNFTsLoading}
      align={CardListAlignTypes.left}
    >
      {nfts?.map((nft: NFT, i: number) => (
        <Center
          key={i}
          onClick={() => (nft.nftId ? push(`/nft/${nft.nftId}`) : null)}
        >
          <NFTCard
            data={nft}
            flag={nft.nftId ? null : "Not created"}
            attributes={{
              Address: nft.collectionAddress.slice(0, 10) + "..." || "-",
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
