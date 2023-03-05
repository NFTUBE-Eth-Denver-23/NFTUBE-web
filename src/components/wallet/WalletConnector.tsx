import React, { useCallback, useEffect, useRef } from "react"

import { useModal } from "hooks/useModal"
import styled from "@emotion/styled"
import { Spacing, Text } from "components/ui"
import Button, { TextButton } from "components/ui/Buttons"
import { colors } from "constants/colors"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { injected } from "connectors/connectors"
import { isSupportedChain } from "constants/chains"
import { useUser } from "hooks/useAuth"
import { switchToChain, switchToDefaultChain } from "utils/walletHelpers"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { queryWalletByUserIdAndChain } from "api/wallets"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { shortenAddress } from "utils/format"
import { disconnect } from "process"
import { Toast } from "components/ui/Toast"
import { NoEthereumProviderError } from "@web3-react/injected-connector"

export function useWalletConnectorDialog() {
  const { open, close } = useModal()
  return useCallback(() => {
    open(<WalletConnectorModal onClose={close} />)
  }, [open, close])
}

function WalletConnectorModal({ onClose }: { onClose: () => void }) {
  const { activate, deactivate, active, account, chainId, error } =
    useWeb3React()

  const { browsingChainId } = useBrowsingChain()

  const isChainValid = active
    ? isSupportedChain(chainId)
    : error instanceof UnsupportedChainIdError
    ? false
    : true

  const isOnBrowsingChain = browsingChainId == chainId

  function renderDescription() {
    if (!account) {
      return <React.Fragment>Please connect your wallet</React.Fragment>
    } else if (!isOnBrowsingChain) {
      return (
        <React.Fragment>
          Please go ahead and switch your browsing chain on the navigation bar!
        </React.Fragment>
      )
    } else if (!isChainValid) {
      return (
        <React.Fragment>
          You're on a network unsupported by NFTube!
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>You're currently connected to NFTube</React.Fragment>
      )
    }
  }

  return (
    <Container>
      <TextContainer>
        <Text weight={700} size={25}>
          {!account
            ? "Connect"
            : !isOnBrowsingChain
            ? "Not on browsing chain"
            : !isChainValid
            ? "Unsupported chain"
            : "Connected"}
        </Text>
        <Spacing height={10}></Spacing>
        <Text
          style={{ textAlign: "center" }}
          weight={500}
          size={17}
          color={colors.gray2}
        >
          {renderDescription()}
        </Text>
      </TextContainer>
      <ButtonsContainer>
        <Button
          onClick={async () => {
            if (!account) {
              console.log("ACT")
              // const auth = await injected.isAuthorized()
              const auth = await injected.isAuthorized()
              console.log("?")
              await activate(injected, (error) => {
                console.log("ERR: ", error)
                if (error instanceof UnsupportedChainIdError) {
                  Toast.error(
                    `Unsupport chain! We support Mantle, Neon, Aurora, and Polygon`
                  )
                } else if (error instanceof NoEthereumProviderError) {
                  Toast.error(
                    `No ethereum provider detected.
                        Please install provider and refresh`
                  )
                }
              })
            } else if (!isOnBrowsingChain) {
              console.log("BCH")
              await switchToChain(browsingChainId)
            } else if (!isChainValid) {
              console.log("INVALID")
              await switchToDefaultChain()
            } else {
              deactivate()
            }
            onClose()
          }}
        >
          {!account
            ? `Connect`
            : !isOnBrowsingChain
            ? "Switch"
            : !isChainValid
            ? "Switch"
            : "Disconnect"}
        </Button>
      </ButtonsContainer>
    </Container>
  )
}

const Container = styled.div`
  max-width: 400px;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
`
