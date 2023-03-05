import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import InfoIcon from "components/icons/InfoIcon"
import { Divider, Text } from "components/ui"
import { colors } from "constants/colors"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import Image from "next/image"
import { useQuery } from "react-query"
import { queryBalanceOf, queryCurrentSupply } from "src/abi-calls/NFTubeERC1155"
import { Collection } from "types/Collection"
import { NFT } from "types/NFT"

export default function Details({
  collection,
  nft,
  account,
}: {
  collection: Collection
  nft: NFT
  account: string
}) {
  const { library } = useWeb3React()
  const { browsingChainId } = useBrowsingChain()

  const { data: currentSupply } = useQuery(
    typeof nft?.tokenId === "number" &&
      nft?.collectionAddress && [
        "query_nft_current_supply",
        nft?.tokenId,
        nft?.collectionAddress,
      ],
    async () => {
      return await queryCurrentSupply({
        chainId: browsingChainId,
        collectionAddress: nft.collectionAddress,
        tokenId: nft.tokenId,
      })
    }
  )

  const { data: ownedSupply } = useQuery(
    typeof nft?.tokenId === "number" &&
      nft?.collectionAddress &&
      account && [
        "query_nft_owned_supply",
        nft?.tokenId,
        nft?.collectionAddress,
        account,
      ],
    async () => {
      return await queryBalanceOf({
        chainId: browsingChainId,
        collectionAddress: nft.collectionAddress,
        tokenId: nft.tokenId,
        account,
      })
    }
  )

  return (
    <Container>
      <TitleContainer>
        <InfoIcon width={30} height={30}></InfoIcon>
        <Text weight={700} size={25}>
          Details
        </Text>
      </TitleContainer>
      <Divider width="100%" height={1} color={colors.gray3}></Divider>
      <RowContainer>
        <Row>
          <Text>Owned</Text>
          <Text weight={600}>{ownedSupply}</Text>
        </Row>
        <Row>
          <Text>Supply Left</Text>
          <Text weight={600}>{nft?.supply - currentSupply}</Text>
        </Row>
        <Row>
          <Text>Total Supply</Text>
          <Text weight={600}>{nft?.supply}</Text>
        </Row>
        <Row>
          <Text>Contract Address</Text>
          <Text weight={600}>{`${nft?.collectionAddress.slice(
            0,
            5
          )} ... ${nft?.collectionAddress.slice(
            nft?.collectionAddress.length - 5,
            nft?.collectionAddress.length
          )}`}</Text>
        </Row>
        <Row>
          <Text>Token ID</Text>
          <Text weight={600}>{nft?.tokenId}</Text>
        </Row>
        <Row>
          <Text>Token Standard</Text>
          <Text weight={600}>{collection?.standard}</Text>
        </Row>
        <Row>
          <Text>Blockchain</Text>
          <Text weight={600}>{collection?.chain}</Text>
        </Row>
      </RowContainer>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  border: 1px solid ${colors.gray3};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 20px 0px 20px;
`

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px 20px 20px 20px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
