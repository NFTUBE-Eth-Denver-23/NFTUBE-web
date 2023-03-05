import { ReactNode, useCallback } from "react"

import styled from "@emotion/styled"
import { useModal } from "hooks/useModal"
import { Asset, AssetType } from "types/Asset"
import { Divider, Spacing, Text } from "components/ui"
import { colors } from "constants/colors"
import InfoIcon from "components/icons/InfoIcon"
import { NFT } from "types/NFT"
import { Collection } from "types/Collection"
import { Media } from "utils/css"
import { MediaType, checkMediaType } from "utils/media"
import Video from "components/ui/Video"

export function useAssetDialog() {
  const { open, close } = useModal()
  return {
    useCallback: useCallback(
      ({
        asset,
        collectionData,
        nftData,
        refetchAssets,
        viewOnly,
        children,
      }: {
        asset: Asset
        collectionData: Collection
        nftData: NFT
        refetchAssets?: any
        viewOnly?: boolean
        children?: ReactNode
      }) => {
        open(
          <AssetModal
            asset={asset}
            collectionData={collectionData}
            nftData={nftData}
            refetchAssets={refetchAssets}
            viewOnly={viewOnly}
            close={close}
          >
            {children}
          </AssetModal>
        )
      },
      [open, close]
    ),
    open,
    close,
  }
}

function AssetModal({
  asset,
  collectionData,
  nftData,
  refetchAssets,
  viewOnly,
  children,
  close,
}: {
  asset: Asset
  collectionData: Collection
  nftData: NFT
  refetchAssets?: any
  viewOnly?: boolean
  children?: ReactNode
  close?: () => void
}) {
  const processedText = ["Unprocessed", "Processing", "Processed"]
  const mediaType = checkMediaType(asset.assetURL)

  return (
    <Container>
      {mediaType === MediaType.IMAGE ? (
        <Img src={asset.assetURL} />
      ) : mediaType === MediaType.VIDEO ? (
        <Video src={asset.assetURL} layout="fill" objectFit="cover" />
      ) : null}

      <DetailsContainer>
        <TitleContainer>
          <InfoIcon width={30} height={30}></InfoIcon>
          <Text weight={700} size={25}>
            Asset
          </Text>
        </TitleContainer>
        <Divider width="100%" height={1} color={colors.gray3}></Divider>
        <RowContainer>
          <Row>
            <Text>Visibility:</Text>
            <Text weight={600}>{asset?.visibility ? "visible" : "hidden"}</Text>
          </Row>
          {asset.assetType != AssetType.PRODUCT && (
            <Row>
              <Text>Signature Processed:</Text>
              <Text weight={600}>{processedText[asset?.processed || 0]}</Text>
            </Row>
          )}
          <Row>
            <Text>Represents:</Text>
            <Text style={{ textAlign: "right" }} weight={600}>
              {nftData?.name}
            </Text>
          </Row>
          <Row>
            <Text>Creator:</Text>
            <Text weight={600}>{`${asset?.creatorAddress.slice(
              0,
              5
            )} ... ${asset?.creatorAddress.slice(
              asset?.creatorAddress.length - 5,
              asset?.creatorAddress.length
            )}`}</Text>
          </Row>
          <Row>
            <Text>Type:</Text>
            <Text weight={600}>{asset?.assetType}</Text>
          </Row>
          <Spacing height={10}></Spacing>
          {asset.assetType == AssetType.PRODUCT && (
            <Info>
              <InfoIcon width={20} height={20}></InfoIcon>
              <Text>Products photos are not scannable by default</Text>
            </Info>
          )}
        </RowContainer>
        {children}
      </DetailsContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: 20px;
  scroll: auto;
  ${Media.screen("lg")(`
    flex-direction: row;
    padding-top: 0px;
  `)}
`

const Img = styled.img`
  max-width: 500px;
  height: undefined;
`

const DetailsContainer = styled.div`
  min-width: 400px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TitleContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 20px 0px 20px;
`

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px 20px 20px 20px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Info = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
`

export default AssetModal
