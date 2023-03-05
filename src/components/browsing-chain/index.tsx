import styled from "@emotion/styled"
import Image from "next/image"

import { Media } from "utils/css"

import { getChain } from "../../constants/chains"
import { useChainDialog } from "./ChainModal"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { useMounted } from "hooks/common"

export function BrowsingChain() {
  const mounted = useMounted()
  const openNetworkModal = useChainDialog()
  const { browsingChainId } = useBrowsingChain()

  if (!mounted) return null
  return (
    <NetworkButton onClick={openNetworkModal}>
      <ChainInfo>
        <Image
          src={getChain(browsingChainId)?.icon}
          layout="fixed"
          width={20}
          height={20}
        />
        <ChainText>{getChain(browsingChainId)?.chainName}</ChainText>
      </ChainInfo>
    </NetworkButton>
  )
}

const NetworkButton = styled.button`
  disply: flex;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  border: 2px solid #e4e4e4;
  border-radius: 30px;
  background-color: white;
  height: 45px;
  ${Media.screen("sm")("padding: 0px 6px;")}
`
const ChainInfo = styled.div`
  display: flex;
  text-align: center;
  vertical-align: middle;
  align-items: center;
  padding: 0 10px;
`
const ChainText = styled.span`
  display: inline-block;
  margin: 0 0 0 6px;
  display: none;
  ${Media.screen("sm")("display: block;")}
`
