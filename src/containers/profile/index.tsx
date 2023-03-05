import { ProfileTabBar } from "components/profile-tab-bar/ProfileTabBar"
import { MainNavbar } from "components/MainNavbar"
import styled from "@emotion/styled"
import SocialIcons from "components/ui/SocialIcons"
import { Divider, Text } from "components/ui"
import WalletAddress from "components/WalletAddress"
import { getChain } from "constants/chains"
import { ProfilePhoto } from "components/ProfilePhoto"
import { colors } from "constants/colors"
import { CoverPhoto } from "components/CoverPhoto"
import Button, { ButtonTheme, TextButton } from "components/ui/Buttons"
import { useRouter } from "next/router"
import { ProfileTabType } from "components/profile-tab-bar"
import OwnedList from "./OwnedList"
import CreatedList from "./CreatedList"
import FavoritedList from "./FavoritedList"
import WatchList from "./WatchList"
import { useWalletHistoryDialog } from "components/wallet/WalletHistory"
import { useUser } from "hooks/useAuth"
import { useQuery } from "react-query"
import { Path } from "utils/url"
import React from "react"
import { useMounted } from "hooks/common"
import { queryWalletByUserIdAndChain } from "api/wallets"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { queryUserById } from "api/users"

export default function Profile({ tab }) {
  const mounted = useMounted()
  const profileId = Path.get("id")
  const { push } = useRouter()
  const { user } = useUser()
  const { browsingChainId } = useBrowsingChain()
  const openWalletHistory = useWalletHistoryDialog()
  const queryId = profileId ? profileId : user.userId
  const isSelf = profileId == user.userId || !profileId

  const { data: userData } = useQuery(
    queryId && ["query_user", queryId],
    async () => {
      return await queryUserById(queryId)
    }
  )

  const { isLoading: walletLoading, data: walletData } = useQuery(
    user.userId && ["query_wallet", user.userId],
    async () => {
      return await queryWalletByUserIdAndChain({
        userId: user.userId,
        chainId: browsingChainId,
      })
    },
    {
      staleTime: Infinity,
    }
  )

  function redirectToEdit() {
    return isSelf
      ? () => {
          push("/profile/edit")
        }
      : undefined
  }

  if (!mounted) return null
  return (
    <Container>
      <MainNavbar />
      <CoverPhoto onChange={redirectToEdit()} src={userData?.coverPhoto} />
      <DetailsContainer>
        <DetailsContent>
          <ProfilePhotoContainer>
            {userData?.profilePhoto ? (
              <ProfilePhoto
                onChange={redirectToEdit()}
                src={userData?.profilePhoto}
                size={180}
              />
            ) : queryId ? (
              <ProfilePhoto
                onChange={redirectToEdit()}
                id={userData?.userId}
                size={180}
              />
            ) : (
              <ProfilePhoto onChange={redirectToEdit()} size={180} />
            )}
          </ProfilePhotoContainer>
          <TitleContainer>
            <Text weight={700} size={30}>
              {userData?.userTag || "--"}
            </Text>
            <IconsContainer>
              <SocialIcons
                website={userData?.socialLinks?.website}
                discord={userData?.socialLinks?.discord}
                twitter={userData?.socialLinks?.twitter}
                telegram={userData?.socialLinks?.telegram}
                medium={userData?.socialLinks?.medium}
              />
            </IconsContainer>
          </TitleContainer>
          <WalletContainer>
            <WalletAddress
              onClick={() => push("/profile/edit/wallet")}
              chain={browsingChainId ? getChain(browsingChainId) : "--"}
              address={walletData ? walletData : "--"}
            />
            <Divider height="100%" color={colors.gray4} width={1} />
            {isSelf && walletData ? (
              <TextButton onClick={openWalletHistory}>
                View all wallets
              </TextButton>
            ) : isSelf && !walletData ? (
              <TextButton onClick={() => push("/profile/edit/wallet")}>
                Connect a wallet
              </TextButton>
            ) : null}
          </WalletContainer>
          <Text weight={500} size={18}>
            {userData?.description || "No description available."}
          </Text>
          <InfoContent>
            {isSelf && (
              <ButtonsContainer>
                <Button
                  onClick={() => {
                    push("/profile/edit")
                  }}
                  style={{ width: 200, height: 50 }}
                >
                  Edit Profile
                </Button>
                <Button
                  theme={"secondary" as ButtonTheme}
                  style={{ width: 200, height: 50 }}
                  onClick={() => {
                    push(`/create`)
                  }}
                >
                  Create
                </Button>
              </ButtonsContainer>
            )}
          </InfoContent>
        </DetailsContent>
      </DetailsContainer>
      <ProfileTabBar tab={tab} />
      <ContentContainer>
        {(tab === ProfileTabType.OWNED || !tab) && (
          <OwnedList address={walletData} />
        )}
        {tab === ProfileTabType.CREATED && (
          <CreatedList
            address={walletData}
            userId={isSelf ? user?.userId : null}
          />
        )}
        {tab === ProfileTabType.FAVORITED && <FavoritedList userId={queryId} />}
        {tab === ProfileTabType.WATCHLIST && <WatchList userId={queryId} />}
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
`

const ProfilePhotoContainer = styled.div`
  position: relative;
  top: -180px;
  margin-bottom: -180px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
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
  padding: 20px;
  padding-bottom: 50px;
`

const InfoContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`

const ButtonsContainer = styled.div`
  display: flex;
  gap: 7px;
`
