import React from "react"

import styled from "@emotion/styled"
import WebsiteIcon from "components/icons/WebsiteIcon"
import DiscordIcon from "components/icons/DiscordIcon"
import TwitterIcon from "components/icons/TwitterIcon"
import TelegramIcon from "components/icons/TelegramIcon"
import EtherscanIcon from "components/icons/EtherscanIcon"
import MediumIcon from "components/icons/MediumIcon"
import Link from "next/link"

interface Props {
  discord?: string
  twitter?: string
  medium?: string
  website?: string
  telegram?: string
  etherscan?: string
  color?: string
}

export default function SocialIcons(props: Props) {
  const { discord, twitter, medium, website, telegram, etherscan, color } =
    props
  return (
    <Container>
      {website ? (
        <Link passHref href={website}>
          <Icon target="_blank">
            <WebsiteIcon
              style={{ cursor: "pointer" }}
              color={color}
              height={30}
              width={30}
            />
          </Icon>
        </Link>
      ) : null}
      {discord ? (
        <Link passHref href={discord}>
          <Icon target="_blank">
            <DiscordIcon color={color} height={30} width={30} />
          </Icon>
        </Link>
      ) : null}
      {twitter ? (
        <Link passHref href={twitter}>
          <Icon target="_blank">
            <TwitterIcon color={color} height={30} width={30} />
          </Icon>
        </Link>
      ) : null}
      {telegram ? (
        <Link passHref href={telegram}>
          <Icon target="_blank">
            <TelegramIcon color={color} height={30} width={30} />
          </Icon>
        </Link>
      ) : null}
      {etherscan ? (
        <Link passHref href={etherscan}>
          <Icon target="_blank">
            <EtherscanIcon
              color={color}
              height={25}
              width={25}
              style={{ marginTop: 4 }}
            />
          </Icon>
        </Link>
      ) : null}
      {medium ? (
        <Link passHref href={medium}>
          <Icon target="_blank">
            <MediumIcon color={color} height={30} width={30} />
          </Icon>
        </Link>
      ) : null}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`
const Icon = styled.a`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`
