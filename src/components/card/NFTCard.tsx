import React, { ReactNode } from "react"

import styled from "@emotion/styled"

import { NFT } from "types/index"

import { CommonCard } from "./CommonCard"
import { ipfsToHttp } from "utils/url"

import { Spacing } from "components/layout"
import { SIUints } from "utils/format"
import { colors } from "constants/colors"
import ScanIcon from "components/icons/ScanIcon"
import { MediaType, checkMediaType } from "utils/media"

interface Props {
  data: NFT
  flag?: string
  attributes?: Object
  children?: ReactNode
  hideHover?: boolean
  disabled?: boolean
}

export function NFTCard({
  data,
  attributes,
  flag,
  hideHover,
  children,
  disabled,
}: Props) {
  const { name, scanCount, imageURL } = data
  const width = 222
  const height = 190
  return (
    <CommonCard
      disabled={disabled}
      width={width}
      hideHover={hideHover}
      name={name ?? "--"}
      header={
        <Container>
          {checkMediaType(imageURL) === MediaType.IMAGE ? (
            <CommonCard.Image
              name={name ?? "--"}
              url={imageURL ? ipfsToHttp(imageURL) : null}
              width={width}
              height={height}
            >
              {flag ? (
                <Flag>{flag}</Flag>
              ) : scanCount ? (
                <Flag>
                  <ScanIcon width={10} height={10} color={colors.white} />
                  <Spacing width={7} />
                  {SIUints.format(200)}
                </Flag>
              ) : null}
            </CommonCard.Image>
          ) : checkMediaType(imageURL) === MediaType.VIDEO ? (
            <CommonCard.Video
              src={imageURL ? ipfsToHttp(imageURL) : null}
              width={width}
              height={height}
            >
              {flag ? (
                <Flag>{flag}</Flag>
              ) : scanCount ? (
                <Flag>
                  <ScanIcon width={10} height={10} color={colors.white} />
                  <Spacing width={7} />
                  {SIUints.format(200)}
                </Flag>
              ) : null}
            </CommonCard.Video>
          ) : null}
          <Spacing width={4} />
        </Container>
      }
      attributes={attributes}
    >
      {children}
    </CommonCard>
  )
}

const Container = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`

const Flag = styled.div`
  font-family: Gilroy;
  display: flex;
  align-items: center;
  color: ${colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  background: ${colors.black};
  padding: 7px 6px;
  border-radius: 10px 0px 0px 0px;
`
