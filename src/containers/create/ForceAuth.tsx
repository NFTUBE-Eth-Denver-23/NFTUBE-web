import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import { Spacing } from "components/layout"
import { MainNavbar } from "components/MainNavbar"
import { Text } from "components/ui"
import Button from "components/ui/Buttons"
import { useWalletConnectorDialog } from "components/wallet/WalletConnector"
import { colors } from "constants/colors"
import { useBrowsingChain } from "hooks/useBrowsingChain"

export default function ForceAuth({ children }) {
  const { active, account, chainId } = useWeb3React()
  const openWalletConnector = useWalletConnectorDialog()
  const { browsingChainId } = useBrowsingChain()

  console.log("chainID: ", chainId, browsingChainId)
  const authPass = active && chainId == browsingChainId

  if (!authPass) {
    return (
      <Container>
        <MainNavbar></MainNavbar>
        <Center>
          <Text
            font="Gilroy"
            weight="700"
            size={32}
            lineHeight={38}
            color={colors.black}
          >
            Wallet not connected
          </Text>
          <Spacing height={20} />
          <Text font="Gilroy" weight="600" size={22} color={colors.gray1}>
            Please connect your wallet to continue
          </Text>
          <Spacing height={56} />
          <StyledButton
            onClick={() => {
              openWalletConnector()
            }}
          >
            Connect
          </StyledButton>
        </Center>
      </Container>
    )
  } else {
    return children
  }
}

export enum OptionStandardType {
  NEW = "new",
  EXISTING = "existing",
}

const Container = styled.div`
  width: 100%;
  max-width: 1248px;
  margin: 0 auto;
`

const Center = styled.div`
  height: calc(100vh - 156px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled(Button)`
  max-width: 790px;
  width: 100%;
`
