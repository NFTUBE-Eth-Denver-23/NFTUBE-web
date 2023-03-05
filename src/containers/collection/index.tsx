import { MainNavbar } from "components/MainNavbar"
import styled from "@emotion/styled"
import SocialIcons from "components/ui/SocialIcons"
import { Divider, Text } from "components/ui"
import WalletAddress from "components/WalletAddress"
import { getChainByTag } from "constants/chains"
import InfoTab from "components/InfoTab"
import { CollectionPhoto } from "components/CollectionPhoto"
import { colors } from "constants/colors"
import { CoverPhoto } from "components/CoverPhoto"
import Button, { ButtonTheme } from "components/ui/Buttons"
import { useRouter } from "next/router"
import { Path } from "utils/url"
import StarIcon from "components/icons/StarIcon"
import ScanIcon from "components/icons/ScanIcon"
import List from "./List"
import { useMutation, useQuery } from "react-query"
import {
  likeCollection,
  queryCollection,
  queryCollectionScanAndViewCount,
  queryCollectionUserRelation,
  unlikeCollection,
} from "src/api/collections"
import { queryNFTsByCollectionId } from "src/api/nfts"
import { queryUserByAddress } from "src/api/users"
import { shortenAddress } from "utils/format"
import EyeIcon from "components/icons/EyeIcon"
import { CollectionUserRelation } from "types/Collection"
import { useUser } from "hooks/useAuth"
import { Toast } from "components/ui/Toast"
import { queryWalletByUserIdAndChain } from "api/wallets"
import { useBrowsingChain } from "hooks/useBrowsingChain"

export default function Collection() {
  const { push } = useRouter()
  const { user } = useUser()
  const { browsingChainId } = useBrowsingChain()
  const id = Path.get("id")

  const { data: walletData } = useQuery(
    user.userId && ["query_wallet", user.userId],
    async () => {
      return await queryWalletByUserIdAndChain({
        userId: user.userId,
        chainId: browsingChainId,
      })
    }
  )

  const { data: collectionData } = useQuery(
    id && ["query_collection_by_id", id],
    async () => {
      return await queryCollection(id)
    }
  )

  const { data: userData } = useQuery(
    collectionData?.creatorAddress && [
      `query_user_by_address`,
      collectionData?.creatorAddress,
    ],
    async () => {
      return await queryUserByAddress({
        address: collectionData?.creatorAddress,
        chain: collectionData.chain,
      })
    }
  )

  const { data: nftsData, isLoading: nftsLoading } = useQuery(
    id && ["query_nfts_by_collection_id", id],
    async () => {
      return await queryNFTsByCollectionId(id)
    }
  )

  const { data: scanAndViewCount, isLoading: scanAndViewCountLoading } =
    useQuery(id && ["query_collection_scan_and_view_count", id], async () => {
      return await queryCollectionScanAndViewCount(id)
    })

  const {
    data: collectionUserRelation,
    isLoading: collectionUserRelationLoading,
    refetch,
  }: {
    data: CollectionUserRelation
    isLoading: boolean
    refetch: any
  } = useQuery(
    collectionData?.collectionId &&
      user?.userId && [
        "query_nft_user_relation",
        collectionData?.collectionId,
        user?.userId,
      ],
    async () => {
      return await queryCollectionUserRelation({
        collectionId: collectionData?.collectionId,
        userId: user?.userId,
      })
    }
  )

  const { mutate: likeCollectionMutate, isLoading: likeCollectionLoading } =
    useMutation(
      collectionData?.collectionId &&
        user?.userId && [
          "like_nft",
          collectionData?.collectionId,
          user?.userId,
        ],
      async () => {
        await likeCollection({
          collectionId: collectionData?.collectionId,
          userId: user?.userId,
        })
      },
      {
        onSuccess: () => {
          refetch()
          Toast.success("Collection marked!")
        },
        onError: (error: any) => {
          Toast.error(
            error.message
              ? error.message
              : "Could not mark collection. Please try again later."
          )
        },
      }
    )

  const { mutate: unlikeCollectionMutate, isLoading: unlikeCollectionLoading } =
    useMutation(
      collectionData?.collectionId &&
        user?.userId && [
          "like_nft",
          collectionData?.collectionId,
          user?.userId,
        ],
      async () => {
        await unlikeCollection({
          collectionId: collectionData?.collectionId,
          userId: user?.userId,
        })
      },
      {
        onSuccess: () => {
          refetch()
          Toast.success("Collection unmarked!")
        },
        onError: (error: any) => {
          Toast.error(
            error.message
              ? error.message
              : "Could not mark nft. Please try again later."
          )
        },
      }
    )

  const creatorInfo = userData
    ? userData.userTag
    : shortenAddress(collectionData?.creatorAddress)
  const isCreator = walletData == collectionData?.creatorAddress

  return (
    <Container>
      <MainNavbar />
      <CoverPhoto
        onChange={isCreator && (() => push(`/collection/edit/${id}`))}
        src={collectionData?.coverPhoto}
      />
      <DetailsContainer>
        <DetailsContent>
          <RepresentativePhotoContainer>
            <CollectionPhoto
              onChange={isCreator && (() => push(`/collection/edit/${id}`))}
              size={180}
              src={collectionData?.mainPhoto}
            />
          </RepresentativePhotoContainer>
          <TitleContainer>
            <Text weight={700} size={30}>
              {collectionData?.name}
            </Text>
            <IconsContainer>
              <SocialIcons
                website={collectionData?.socialLinks?.website}
                discord={collectionData?.socialLinks?.discord}
                etherscan={collectionData?.socialLinks?.etherscan}
                twitter={collectionData?.socialLinks?.twitter}
                telegram={collectionData?.socialLinks?.telegram}
                medium={collectionData?.socialLinks?.medium}
              />
              <Divider height="100%" color={colors.gray4} width={1} />
              <StarIconContainer
                isLoading={
                  collectionUserRelationLoading ||
                  likeCollectionLoading ||
                  unlikeCollectionLoading
                    ? 1
                    : 0
                }
                onClick={() =>
                  collectionUserRelation?.isLiked
                    ? unlikeCollectionMutate()
                    : likeCollectionMutate()
                }
              >
                <StarIcon
                  color={
                    collectionUserRelation?.isLiked
                      ? colors.primary.color
                      : "black"
                  }
                  filled={collectionUserRelation?.isLiked}
                  height={30}
                  width={30}
                />
              </StarIconContainer>
            </IconsContainer>
          </TitleContainer>
          <WalletAddress
            chain={getChainByTag(collectionData?.chain)}
            address={collectionData?.address}
          />
          <Text weight={500} size={18}>
            {collectionData?.description}
          </Text>
          <InfoContent>
            <InfoContainer>
              <InfoTab
                title="Creator"
                content={creatorInfo}
                onClick={() => {
                  userData && push(`/profile/${userData?.userId}`)
                }}
              />
              <InfoTab
                title="Scan Count"
                content={
                  scanAndViewCount?.totalScanCount
                    ? scanAndViewCount?.totalScanCount
                    : 0
                }
                icon={<ScanIcon height={17} width={17} />}
              />
              <InfoTab
                title="View Count"
                content={
                  scanAndViewCount?.totalViewCount
                    ? scanAndViewCount?.totalViewCount
                    : 0
                }
                icon={<EyeIcon height={25} width={25} />}
              />
            </InfoContainer>
            {isCreator ? (
              <ButtonsContainer>
                <Button
                  onClick={() => push(`/collection/edit/${id}`)}
                  style={{ width: 200, height: 50 }}
                >
                  Edit Collection
                </Button>
                {collectionData?.isCreatedByUnic && (
                  <Button
                    theme={"secondary" as ButtonTheme}
                    style={{ width: 200, height: 50 }}
                    onClick={() => push(`/collection/create-nft/${id}`)}
                  >
                    Create New
                  </Button>
                )}
              </ButtonsContainer>
            ) : null}
          </InfoContent>
        </DetailsContent>
      </DetailsContainer>
      <ContentContainer>
        <List nfts={nftsData} isLoading={nftsLoading} />
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
`

const RepresentativePhotoContainer = styled.div`
  position: relative;
  top: -180px;
  margin-bottom: -180px;
  width: 180px;
  height: 180px;
  border-radius: 15px;
  border: 3px solid ${colors.white};
  overflow: hidden;
`

const DetailsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0px;
`

const DetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 1265px;
  padding: 0px 24px;
  gap: 20px;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`

const ContentContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 50px;
`

const InfoContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`

const InfoContainer = styled.div`
  display: flex;
  gap: 30px;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
`

const StarIconContainer = styled.span<{ isLoading: number }>`
  cursor: pointer;
  opacity: ${(p) => (p.isLoading ? "0.5" : "1")};
  &:hover {
    opacity: 0.5;
  }
`
