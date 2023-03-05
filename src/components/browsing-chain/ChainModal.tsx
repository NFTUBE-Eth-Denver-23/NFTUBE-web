import { ReactNode, useCallback } from "react"

import styled from "@emotion/styled"
import { Text } from "components/ui"
import { useModal } from "hooks/useModal"
import { colors } from "constants/colors"
import Image from "next/image"
import { chains } from "constants/chains"
import { useWeb3React } from "@web3-react/core"
import { switchChain } from "utils/walletHelpers"
import { ExternalProvider } from "@ethersproject/providers"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { ChainId } from "types/ChainId"

export function useChainDialog() {
  const { open, close } = useModal()
  return useCallback(() => {
    open(<ChainModal />)
  }, [open, close])
}

function ChainModal() {
  const { library } = useWeb3React()
  const { browsingChainId, setBrowsingChainId } = useBrowsingChain()
  const isProduction = process.env.NODE_ENV == "production"
  return (
    <Container>
      <Text size={20} weight={700}>
        Select Chain
      </Text>
      {Object.keys(chains).map((cid) => {
        const chain = chains[cid]
        if (isProduction && chain.chainId == ChainId.LOCAL_TESTNET) return
        return (
          <NetworkRow
            title={chain.chainName}
            subtext={
              browsingChainId && Number(cid) == browsingChainId
                ? "Current"
                : null
            }
            onClick={async () => {
              const provider = library?.provider as ExternalProvider
              if (provider) {
                const switchResult = await switchChain(
                  provider,
                  Number(cid),
                  chain
                )
                if (!switchResult?.code) {
                  setBrowsingChainId(Number(cid))
                  window.location.reload()
                }
              } else {
                setBrowsingChainId(Number(cid))
              }
            }}
          >
            <Image src={chain.icon} width={30} height={30} />
          </NetworkRow>
        )
      })}
    </Container>
  )
}

interface NetworkRowProps {
  title: string
  subtext?: string
  children: ReactNode
  onClick: () => void
}

function NetworkRow({ title, subtext, children, onClick }: NetworkRowProps) {
  return (
    <SocialLoginContainer onClick={onClick}>
      <SocialContainer>
        {children}
        <Text weight={500} size={15}>
          {title}
        </Text>
      </SocialContainer>
      {subtext ? (
        <Popular>
          <Text size={15} color={colors.white}>
            {subtext}
          </Text>
        </Popular>
      ) : null}
    </SocialLoginContainer>
  )
}

const Container = styled.div`
  max-width: 450px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const SocialLoginContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const SocialContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const Popular = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 15px;
  gap: 20px;
  width: auto;
  height: 20px;
  background: ${colors.primary.color};
  border-radius: 10px;
`

export default ChainModal
