import styled from "@emotion/styled"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { queryWalletByUserIdAndChain } from "api/wallets"
import AddCircleIcon from "components/icons/AddCircleIcon"
import EyeIcon from "components/icons/EyeIcon"
import ScanIcon from "components/icons/ScanIcon"
import InfoTab from "components/InfoTab"
import { MainNavbar } from "components/MainNavbar"
import { Spacing, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { chainIdByTag, isSupportedChain } from "constants/chains"
import { colors } from "constants/colors"
import { useUser } from "hooks/useAuth"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMutation, useQuery } from "react-query"
import { queryAssetsByNFTId } from "src/api/assets"
import { queryCollection } from "src/api/collections"
import { incrementNFTViewCount, queryNFTById } from "src/api/nfts"
import { Collection } from "types/Collection"
import { NFT } from "types/NFT"
import { Media } from "utils/css"
import { safeLocalStorage } from "utils/storage"
import { Path } from "utils/url"
import { commaizeNumber } from "utils/format/commaizeNumber"
import Assets from "./Assets"
import Details from "./Details"
import NFTPhoto from "./NFTPhoto"
import {
  queryCurrentSupply,
  redeemNFTAndEncodeAssets,
} from "src/abi-calls/NFTubeERC1155"
import { useWalletConnectorDialog } from "components/wallet/WalletConnector"
import { Toast } from "components/ui/Toast"

export default function NFTPage() {
  const id = Path.get("id")
  const { push } = useRouter()
  const { user } = useUser()
  const { account } = useWeb3React()

  const {
    data: nftData,
    isLoading: nftLoading,
  }: {
    data: NFT
    isLoading: boolean
  } = useQuery(id && ["query_nft_by_id", id], async () => {
    return await queryNFTById(id)
  })

  const {
    data: collectionData,
    isLoading: collectionLoading,
  }: {
    data: Collection
    isLoading: boolean
  } = useQuery(
    nftData?.collectionId && [
      "query_collection_by_address",
      nftData?.collectionId,
    ],
    async () => {
      return await queryCollection(nftData?.collectionId)
    }
  )

  const {
    data: assetsData,
    isLoading: assetsLoading,
    refetch: refetchAssets,
  } = useQuery(
    nftData?.nftId &&
      account &&
      collectionData?.collectionId && [
        "query_assets_by_nft_id",
        nftData?.nftId,
        account,
        collectionData?.creatorAddress,
      ],
    async () => {
      return await queryAssetsByNFTId(nftData?.nftId, {
        userId: user?.userId,
        creatorAddress: collectionData?.creatorAddress,
        walletAddress: account,
      })
    }
  )

  async function incrementView() {
    const key = `viewed_${nftData?.nftId}`

    if (!safeLocalStorage.get(key)) {
      try {
        await incrementNFTViewCount({
          nftId: nftData?.nftId,
        })
        safeLocalStorage.set(key, JSON.stringify(true))
      } catch {}
    }
  }
  useEffect(() => {
    incrementView()
  }, [nftData?.nftId])

  const isLoading = collectionLoading || nftLoading

  return (
    <Container>
      <MainNavbar />
      <InnerContainer>
        <Center>
          <Section1>
            <NFTPhoto nft={nftData} />
            <PeggedAssetsContainer>
              <AssetsTitleContainer>
                <Text size={25} weight={700}>
                  Pegged Assets
                </Text>
              </AssetsTitleContainer>
              <Spacing height={20} />
              <Assets
                assets={assetsData}
                collectionData={collectionData}
                nftData={nftData}
                refetchAssets={refetchAssets}
              />
              <Spacing height={20} />
            </PeggedAssetsContainer>
          </Section1>
          <Section2>
            <TitleContainer>
              <Text
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Created by{" "}
                <Text color={colors.primary.color} weight={700}>
                  {nftData?.creatorAddress
                    ? nftData?.creatorAddress?.slice(0, 10) + " ..."
                    : "--"}
                </Text>
              </Text>
              <Text size={40} weight={700}>
                {nftData?.name}
              </Text>
              <Text
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Owned by{" "}
                <Text color={colors.primary.color} weight={700}>
                  {nftData?.ownerAddress
                    ? nftData?.ownerAddress?.slice(0, 10) + " ..."
                    : "--"}
                </Text>
              </Text>
            </TitleContainer>
            <Text>{nftData?.description}</Text>
            <TabsContainer>
              <InfoTab
                title="Views"
                content={nftData?.viewCount ? nftData?.viewCount : 0}
                icon={<EyeIcon width={30} height={30} />}
              />
              <InfoTab
                title="Scans"
                content={nftData?.scanCount ? nftData?.scanCount : 0}
                icon={<ScanIcon width={17} height={17} />}
              />
            </TabsContainer>
            <ButtonContainer>
              {!nftData?.isMinted ? (
                <RedeemNFTButton loading={isLoading} nft={nftData} />
              ) : null}
              {nftData?.marketplaceURL && nftData?.isMinted ? (
                <Button
                  loading={isLoading}
                  onClick={() => {
                    push(nftData?.marketplaceURL)
                  }}
                >
                  Go to Marketplace
                </Button>
              ) : null}
            </ButtonContainer>
            <Details
              collection={collectionData}
              nft={nftData}
              account={account}
            />
          </Section2>
        </Center>
      </InnerContainer>
    </Container>
  )
}

function RedeemNFTButton({ loading, nft }: { loading: boolean; nft: NFT }) {
  const { active, chainId, account, library, error } = useWeb3React()
  const openWalletConnector = useWalletConnectorDialog()
  const { browsingChainId } = useBrowsingChain()

  const isChainValid = active
    ? isSupportedChain(chainId)
    : error instanceof UnsupportedChainIdError
    ? false
    : true

  const isOnBrowsingChain = browsingChainId == chainId

  const needsWallet = !active || !isChainValid || !isOnBrowsingChain

  const { mutate, isLoading: redeemLoading } = useMutation(
    ["redeem_nft"],
    async () => {
      const {
        collectionAddress,
        tokenId,
        maxTokenId,
        mintPrice,
        signature,
        supply,
      } = nft
      await redeemNFTAndEncodeAssets({
        account,
        library,
        collectionAddress,
        tokenId,
        maxTokenId,
        maxSupply: supply,
        minPrice: mintPrice,
        signature,
      })
    },
    {
      onSuccess: (data) => {
        Toast.success("Successfully Minted!")
      },
      onError: (error) => {
        Toast.error("Could not mint NFT. Please try again later.")
        console.log("redeem_nft error: ", error)
      },
    }
  )

  const { data: currentSupply, isLoading: currentSupplyLoading } = useQuery(
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

  const soldOut = currentSupply == nft?.supply

  return (
    <Button
      disabled={soldOut}
      loading={loading || redeemLoading || currentSupplyLoading}
      onClick={async () => {
        if (needsWallet) {
          return openWalletConnector()
        }
        mutate()
      }}
    >
      {soldOut
        ? "Sold Out"
        : `Mint (${commaizeNumber(nft?.mintPrice, { decimals: 4 })} ETH)`}
    </Button>
  )
}

const InnerContainer = styled.div`
  ${Media.screen("md")(`
    display: flex;
    align-items: center;
    justify-content: center;
  `)}
`

const Container = styled.div``

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const AssetsTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Center = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px 40px 40px;
  ${Media.screen("md")(`
    flex-direction: row;
    gap: 50px
  `)}
  max-width: 1000px;
`

const Section1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 30px;
`

const Section2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 400px;
  gap: 30px;
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`

const PeggedAssetsContainer = styled.div`
  width: 100%;
`

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`
