import styled from "@emotion/styled"
import Video from "components/ui/Video"
import { colors } from "constants/colors"
import Image from "next/image"
import { NFT } from "types/NFT"
import { Media } from "utils/css"
import { MediaType, checkMediaType } from "utils/media"

export default function NFTPhoto({ nft }: { nft: NFT }) {
  const mediaType = checkMediaType(nft?.imageURL)

  return (
    <PhotoContainer>
      <Image
        src={nft?.imageURL ? nft.imageURL : ""}
        layout="fill"
        objectFit="cover"
      ></Image>
      {mediaType === MediaType.IMAGE ? (
        <Image src={nft?.imageURL} layout="fill" objectFit="cover"></Image>
      ) : mediaType === MediaType.VIDEO ? (
        <Video
          src={nft?.imageURL}
          layout="fixed"
          width="100%"
          height="100%"
          objectFit="cover"
        ></Video>
      ) : null}
    </PhotoContainer>
  )
}

const PhotoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border: 1px solid ${colors.gray3};
  border-radius: 20px;
  background-color: ${colors.gray5};
  ${Media.screen("sm")(`
    width: 500px;
    height: 500px;
  `)}
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  height: 50px;
  width: 100%;
  bottom: 0px;
  left: 0px;
  background-color: white;
`

const HeartIconContainer = styled.div<{ isLoading: number }>`
  cursor: pointer;
  opacity: ${(p) => (p.isLoading ? "0.5" : "1")};
  &:hover {
    opacity: 0.5;
  }
`
