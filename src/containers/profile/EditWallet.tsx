import { MainNavbar } from "components/MainNavbar"
import styled from "@emotion/styled"
import { Spacing, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { useUser } from "hooks/useAuth"
import { useMutation, useQuery } from "react-query"
import { Toast } from "components/ui/Toast"
import { queryUserById } from "api/users"
import { colors } from "constants/colors"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { queryWalletByUserIdAndChain, saveWallet } from "api/wallets"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { isSupportedChain } from "constants/chains"
import { switchToChain, switchToDefaultChain } from "utils/walletHelpers"
import { injected } from "connectors/connectors"
import { signWallet } from "utils/web3/sign"
import { NoEthereumProviderError } from "@web3-react/injected-connector"

export default function EditWallet() {
  const { user } = useUser()
  const { library, account, chainId, active, error, activate, deactivate } =
    useWeb3React()
  const { browsingChainId } = useBrowsingChain()

  const { isLoading: userLoading, data: userData } = useQuery(
    user.userId && ["query_user", user.userId],
    async () => {
      return await queryUserById(user.userId)
    },
    {
      staleTime: Infinity,
    }
  )

  const {
    isLoading: walletLoading,
    refetch,
    data: walletData,
  } = useQuery(
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

  const { mutate, isLoading: saveLoading } = useMutation(
    ["save_wallet"],
    async () => {
      const signature = await signWallet({
        library,
        chainId,
        userId: user?.userId,
      })

      await saveWallet({
        address: account,
        chainId,
        userId: user?.userId,
        signature,
      })
    },
    {
      onSuccess: (data) => {
        refetch()
        Toast.success("Wallet updated!")
      },
      onError: (error) => {
        Toast.error("Could not update wallet. Please try again later.")
      },
    }
  )

  const onWalletSave = async () => {
    if (isOnBrowsingChain && isChainValid && account) {
      mutate()
    } else {
      Toast.error("Could not save wallet. Please connect wallet first")
    }
  }

  const isChainValid = active
    ? isSupportedChain(chainId)
    : error instanceof UnsupportedChainIdError
    ? false
    : true

  const isOnBrowsingChain = browsingChainId == chainId

  return (
    <Container>
      <MainNavbar />
      <DetailsContainer>
        <DetailsContent>
          <CenterContainer>
            <Text weight={700} size={25}>
              Edit your wallet
            </Text>
          </CenterContainer>
          <Spacing height={10}></Spacing>
          <Step>
            <Text size={20} color={colors.black} weight={700}>
              Connect and save your wallet here!
            </Text>
            <Spacing height={5} />
            <Text size={20} color={colors.gray1} weight={600}>
              Last Connected:
            </Text>
            <Text size={20} color={colors.gray1} weight={600}>
              {walletData || "--"}
            </Text>
          </Step>
          <Spacing height={10} />
          <Step>
            <Text size={20} color={colors.black} weight={700}>
              Step 1: Connect your wallet
            </Text>
            <Spacing height={5} />
            <Text size={20} color={colors.gray1} weight={600}>
              Will Connect:
            </Text>
            <Text size={20} color={colors.gray1} weight={600}>
              {isOnBrowsingChain && isChainValid && account ? account : "--"}
            </Text>
            <Spacing height={5} />
            <Button
              style={{ maxWidth: 500 }}
              onClick={async () => {
                if (!isChainValid) {
                  await switchToDefaultChain()
                } else if (!active) {
                  const auth = await injected.isAuthorized()
                  await activate(injected, (error) => {
                    if (error instanceof NoEthereumProviderError) {
                      Toast.error(
                        `No ethereum provider detected. 
                        Please install provider and refresh`
                      )
                    }
                  })
                } else if (!isOnBrowsingChain) {
                  await switchToChain(browsingChainId)
                } else {
                  await deactivate()
                }
              }}
            >
              {!active
                ? "Connect"
                : !isChainValid || !isOnBrowsingChain
                ? "Switch Chain"
                : "Disconnect"}
            </Button>
          </Step>
          <Spacing height={10}></Spacing>
          <Step>
            <Text size={20} color={colors.black} weight={700}>
              Step 2: Save your wallet
            </Text>
            <Text
              weight="600"
              size={15}
              lineHeight={24}
              color={colors.natural1.color2}
            ></Text>
            <Spacing height={5} />
            <Button
              style={{ maxWidth: 500 }}
              loading={walletLoading || userLoading || saveLoading}
              onClick={onWalletSave}
            >
              Save
            </Button>
          </Step>
        </DetailsContent>
      </DetailsContainer>
    </Container>
  )
}

const Container = styled.div`
  flex-direction: column;
  height: 100vh;
`

const CenterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 0px;
`

const DetailsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  padding: 40px 24px;
  gap: 25px;
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3px;
  align-items: center;
`

const InputContainer = styled.div<{ error?: string }>`
  flex: 1;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`

const StyledInput = styled.div`
  min-width: 0px;
  flex: 1;
  border: none;
  background: none;
`
