import styled from "@emotion/styled"

import { Text } from "components/ui"
import { Chain } from "constants/chains"
import { colors } from "constants/colors"
import Image from "next/image"

interface Props {
  address: string
  chain: Chain
  onClick?: () => void
}
export default function WalletAddress({ address, chain, onClick }: Props) {
  return (
    <Container clickEnabled={onClick ? 1 : 0} onClick={onClick && onClick}>
      <Image src={chain?.icon} width={25} height={25} />
      <Text color={colors.gray1} size={20}>
        {address && address != "" ? address : "--"}
      </Text>
    </Container>
  )
}

const Container = styled.div<{ clickEnabled: number }>`
  display: flex;
  gap: 10px;
  cursor: ${(p) => (p.clickEnabled ? "pointer" : "default")};
  &:hover {
    opacity: ${(p) => (p.clickEnabled ? "0.8" : "1")};
  }
`
