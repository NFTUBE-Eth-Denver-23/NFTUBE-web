import styled from "@emotion/styled"
import DotsIcon from "components/icons/Dots"
import EyeIcon, { EyeClosedIcon } from "components/icons/EyeIcon"
import { colors } from "constants/colors"
import Image from "next/image"
import { Asset, AssetType } from "types/Asset"
import { Collection } from "types/Collection"
import { NFT } from "types/NFT"
import { Media } from "utils/css"
import { useAssetDialog } from "./AssetModal"
import { checkMediaType, MediaType } from "utils/media"
import Video from "components/ui/Video"

export default function Assets({
  assets,
  collectionData,
  nftData,
  refetchAssets,
}: {
  assets: Array<Asset>
  collectionData: Collection
  nftData: NFT
  refetchAssets: any
}) {
  const { useCallback: openAssetModal } = useAssetDialog()
  return (
    <Container>
      <Scroll items={5}>
        {assets?.map((asset, i) => {
          return (
            <Asset
              onClick={() =>
                openAssetModal({
                  asset,
                  collectionData,
                  nftData,
                  refetchAssets,
                })
              }
              key={i}
              asset={asset}
            />
          )
        })}
      </Scroll>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  ${Media.screen("sm")(`
    width: 500px;
  `)}
`

const Scroll = styled.div<{
  items: number
}>`
  display: grid;
  grid-row-gap: 24px;
  grid-template-columns: ${(p) => `repeat(${p.items}, 1fr)`};
  grid-gap: 12px;
  overflow-x: scroll;
`

export function Asset({
  onClick,
  asset,
}: {
  onClick: () => void
  asset: Asset
}) {
  const { assetURL, assetType, visibility, processed } = asset
  const notProcessed = !processed || processed == 0 || processed == 1
  const isProduct = assetType == AssetType.PRODUCT
  const mediaType = checkMediaType(assetURL)

  return (
    <AssetContainer onClick={onClick}>
      {mediaType === MediaType.IMAGE ? (
        <Image src={assetURL} layout="fill" objectFit="cover"></Image>
      ) : mediaType === MediaType.VIDEO ? (
        <Video src={assetURL} layout="fill" objectFit="cover" />
      ) : null}
      <Label>{assetType}</Label>
      {!isProduct && notProcessed ? <Shadow /> : <HoverShadow />}
      <ViewIconContainer>
        {visibility ? (
          <EyeIcon height={20} width={20} />
        ) : (
          <EyeClosedIcon height={20} width={20} />
        )}
      </ViewIconContainer>
      {!isProduct && notProcessed && (
        <LoadingIconContainer>
          <DotsIcon color={colors.white} height={30} width={50} />
        </LoadingIconContainer>
      )}
    </AssetContainer>
  )
}

const Label = styled.div`
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

const AssetContainer = styled.div`
  display: inline-block;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${colors.gray4};
`

const HoverShadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  &:hover {
    background-color: ${colors.black};
    opacity: 0.3;
    transition: 0.2s;
  }
`

const Shadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${colors.black};
  opacity: 0.3;
`

const ViewIconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`

const LoadingIconContainer = styled.div`
  position: absolute;
  height: 30px;
  width: 30px;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`
