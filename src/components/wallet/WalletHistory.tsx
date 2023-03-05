import React, { useCallback } from "react"

import { useModal } from "hooks/useModal"
import styled from "@emotion/styled"
import { Text } from "components/ui"
import { TextButton } from "components/ui/Buttons"
import { useQuery } from "react-query"
import { useUser } from "hooks/useAuth"
import { useWeb3React } from "@web3-react/core"
import { queryWalletsByUserIdAndChain } from "api/wallets"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { useRouter } from "next/router"

export function useWalletHistoryDialog() {
  const { open } = useModal()
  return useCallback(() => {
    open(<WalletHistoryModal />)
  }, [open])
}

function WalletHistoryModal() {
  const { user } = useUser()
  const { push } = useRouter()
  const { browsingChainId } = useBrowsingChain()

  const { isLoading: walletsLoading, data: walletsData } = useQuery(
    browsingChainId && ["query_wallets_by_user_id_and_chain", browsingChainId],
    async () => {
      return await queryWalletsByUserIdAndChain({
        userId: user.userId,
        chainId: browsingChainId,
      })
    }
  )

  return (
    <Container>
      <Text weight={700} size={25}>
        Wallet History
      </Text>
      {walletsData?.length ? (
        <React.Fragment>
          <Section>
            <Text weight={700}>Current</Text>
            <InfoContainer>
              <Row>
                <Text>{walletsData.at(0)?.address?.slice(0, 28) + "..."}</Text>
                <TextButton onClick={() => push("/profile/edit/wallet")}>
                  Change Wallet
                </TextButton>
              </Row>
            </InfoContainer>
          </Section>
          <Section>
            <Text weight={700}>Previous</Text>
            <InfoContainer>
              {walletsData?.length > 1 &&
                walletsData.map((wallet, index: number) => {
                  if (index == 0) return null
                  return (
                    <Row key={index}>
                      <Text>{wallet?.address?.slice(0, 28) + "..."}</Text>
                      {/* <Text weight={600}>{date}</Text> */}
                    </Row>
                  )
                })}
            </InfoContainer>
          </Section>
        </React.Fragment>
      ) : (
        <Text weight={500}>No wallets connected</Text>
      )}
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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
  max-height: 150px;
  overflow: auto;
`

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
