import React, {
  CSSProperties,
  ComponentProps,
  Dispatch,
  MediaHTMLAttributes,
  SetStateAction,
  VideoHTMLAttributes,
  useImperativeHandle,
} from "react"

import styled from "@emotion/styled"

import { NFTCard } from "components/card"
import { Input, Spacing, Text, TextArea, TextButton } from "components/ui"
import AddCircleIcon from "components/icons/AddCircleIcon"
import { colors } from "constants/colors"
import Image from "next/image"
import XIcon from "components/icons/XIcon"
import EyeIcon, { EyeClosedIcon } from "components/icons/EyeIcon"
import { NFT } from "types/NFT"
import { Collection } from "types/Collection"
import { Asset as AssetInterface, AssetType, DefaultAsset } from "types/Asset"
import { insert, remove } from "utils/format/array"
import { v4 as uuidv4 } from "uuid"
import { useAssetUploaderDialog } from "./AssetUploader"
import { formatNumber } from "utils/format/NumberFormat"
import useURLFormatInput from "hooks/common/useURLFormatInput"
import { validateURLsFormat } from "utils/format/url"
import { MediaType, checkMediaType } from "utils/media"
import Video from "components/ui/Video"
import { useUploaderDialog } from "components/Uploader"

export default function NFTEditCard({
  editedCollection,
  nfts,
  setNFTs,
  index,
  mintNew,
  collectionCount,
  urlValidationStateSetter,
}: {
  editedCollection: Collection
  nfts: Array<NFT>
  setNFTs: any
  index: number
  mintNew: boolean
  collectionCount: number
  urlValidationStateSetter: Dispatch<SetStateAction<boolean>>
}) {
  const [marketPlaceRef, marketPlaceValidationRes] =
    useURLFormatInput("market place")
  const openUploader = useUploaderDialog()
  const nft = nfts[index]

  function updateNFT(
    key: string,
    value: string | number | boolean | Array<AssetInterface>
  ) {
    let newNFT = { ...nft }
    newNFT[key] = value
    const newNFTs = insert(nfts, newNFT, index)
    setNFTs(newNFTs)
  }

  function updateAllNFT(
    key: string,
    value: string | number | boolean | Array<AssetInterface>
  ) {
    let newNFTs = nfts.map((nft) => {
      let newNFT = { ...nft }
      newNFT[key] = value
      return newNFT
    })
    // const newNFTs = insert(nfts, newNFT, index)
    setNFTs(newNFTs)
  }

  function updateAsset(urls: Array<string>, assetType: AssetType) {
    const newAssets = [
      ...nft?.assets,
      ...urls?.map((url) => {
        return {
          ...DefaultAsset,
          assetId: uuidv4(),
          assetURL: url,
          assetType,
        }
      }),
    ]
    updateNFT("assets", newAssets)
  }

  return (
    <Container>
      <div>
        <Text size={20} weight={700}>
          NFT
        </Text>

        <NFTCard
          data={{
            name: nft.name,
            tokenId: nft.tokenId,
            ownerAddress: nft.ownerAddress,
            collectionAddress: nft.collectionAddress,
            imageURL: nft.imageURL,
          }}
        >
          {mintNew ? (
            <React.Fragment>
              <Input
                value={nft.supply}
                onChange={(e) => {
                  e.target.value = formatNumber(e.target.value)
                  return updateAllNFT(
                    "supply",
                    Math.ceil(Number(e.target.value))
                  )
                }}
                type="number"
                label="Supply"
                size={20}
                placeholder="1"
              />
              <Spacing height={10} />
            </React.Fragment>
          ) : null}
          <ListedSwitch
            onClick={() => updateNFT("isListed", !nft.isListed)}
            isListed={nft.isListed}
          />
        </NFTCard>
      </div>
      <AssetsContainer>
        <Text size={20} weight={700}>
          Assets
        </Text>
        <AddNewContainer
          onClick={() =>
            openUploader({
              multiple: true,
              callback: (urls) => updateAsset(urls, AssetType.VIDEO),
            })
          }
        >
          <AddCircleIcon color={colors.gray1} width={22} height={22} />
          <Text weight={600} size={15} color={colors.gray1}>
            Add Asset
          </Text>
        </AddNewContainer>
        <AssetList>
          {nft?.assets?.map((asset, index) => {
            return (
              <Asset
                key={index}
                asset={asset}
                onRemove={() => {
                  const newAssets = remove(nft.assets, index)
                  updateNFT("assets", newAssets)
                }}
                onChangeVisibility={() => {
                  let newAsset = { ...asset, visibility: !asset.visibility }
                  let newAssets = [...nft.assets]
                  newAssets.splice(index, 1, newAsset)
                  updateNFT("assets", newAssets)
                }}
              />
            )
          })}
        </AssetList>
      </AssetsContainer>
      <FormsContainer>
        <ShortFormContainer>
          <Input
            value={nft.name}
            onChange={(e) => updateNFT("name", e.target.value)}
            title="Name"
            size={20}
            placeholder="NFTube NFT"
          />
        </ShortFormContainer>
        <TextArea
          value={nft.description}
          onChange={(e) => updateNFT("description", e.target.value)}
          style={{ minHeight: mintNew ? 250 : 155 }}
          title="Description (Optional)"
          autoResize={false}
          label={
            <span>
              The description will be included in this NFT's detail page
              underneath the image.
              <TextButton size={15}> Markdown syntax</TextButton> is supported.
            </span>
          }
          placeholder="Provide a detailed description about this collection."
        />
      </FormsContainer>
      <CloseContainer>
        <XIcon
          onClick={() => {
            let newNFTs: Array<NFT> = remove(nfts, index) as Array<NFT>
            newNFTs = newNFTs.map((newNFT, index) => {
              const newTokenId = collectionCount + index
              newNFT.name =
                (editedCollection.name || "--") + ` #${collectionCount + index}`
              newNFT.tokenId = newTokenId
              return newNFT
            })
            setNFTs(newNFTs)
          }}
          width={20}
          height={20}
        />
      </CloseContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding-right: 15px;
  height: 395px;
`

const FormsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ShortFormContainer = styled.div`
  display: flex;
  gap: 10px;
`

const AssetsContainer = styled.div`
  width: 150px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  overflow-y: scroll;
`

const AddNewContainer = styled.div`
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const AssetList = styled.div`
  overflow: auto;
  height: 100%;
  padding-right: 10px;
`

const CloseContainer = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition: 200ms;
  &:hover {
    opacity: 0.5;
  }
`

function ListedSwitch({ onClick, isListed }) {
  return (
    <SwitchContainer onClick={onClick}>
      {isListed ? (
        <EyeIcon height={20} width={20} />
      ) : (
        <EyeClosedIcon height={20} width={20} />
      )}
      <Text>{isListed ? "Listed" : "Unlisted"}</Text>
    </SwitchContainer>
  )
}

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

function Asset({
  asset,
  onRemove,
  onChangeVisibility,
}: {
  asset: AssetInterface
  onRemove: () => void
  onChangeVisibility: () => void
}) {
  const type =
    asset.assetType.charAt(0).toUpperCase() +
    asset.assetType.slice(1).toLowerCase()
  const mediaType = checkMediaType(asset.assetURL)
  return (
    <AssetContainer>
      {mediaType === MediaType.IMAGE ? (
        <Image src={asset.assetURL} layout="fill" objectFit="cover"></Image>
      ) : mediaType === MediaType.VIDEO ? (
        <Video
          src={asset.assetURL}
          layout="fixed"
          width="100%"
          height="100%"
          objectFit="cover"
        ></Video>
      ) : null}
      <Label>{type}</Label>
      <EditContainer>
        <XIconContainer onClick={() => onRemove()}>
          <XIcon height={17} width={17} />
        </XIconContainer>
        <ChangeVisibilityContainer onClick={() => onChangeVisibility()}>
          {asset.visibility ? (
            <EyeIcon color={colors.gray1} height={30} width={30} />
          ) : (
            <EyeClosedIcon color={colors.gray1} height={30} width={30} />
          )}
        </ChangeVisibilityContainer>
      </EditContainer>
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  background-color: ${colors.gray4};
  border-radius: 10px;
  margin-bottom: 10px;
`

const EditContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
  &:hover {
    background-color: ${colors.black};
    opacity: 0.3;
    transition: 0.2s;
  }
`

const XIconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`

const ChangeVisibilityContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 5px;
`
