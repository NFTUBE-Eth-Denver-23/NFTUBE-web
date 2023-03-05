import { CSSProperties, useRef } from "react"

import styled from "@emotion/styled"

import { colors } from "constants/colors"
import Image from "next/image"
import EditIcon from "./icons/EditIcon"
import { InputLabel, Text } from "./ui"
import AddIcon from "./icons/AddIcon"

interface Props {
  callback?: () => void
  title?: string
  label?: string
  src?: string
  size?: string
  width?: string
  height?: string
  style?: CSSProperties
}

export function Upload({
  title,
  label,
  callback,
  src,
  width,
  height,
  style,
}: Props) {
  const avatarRef = useRef()

  return (
    <Container>
      {title && (
        <Text size={20} color={colors.black} weight={700}>
          {title}
        </Text>
      )}
      {label && <InputLabel>{label}</InputLabel>}
      {src ? (
        <PhotoContainer width={width} height={height} style={style}>
          <Image src={src} layout="fill" objectFit="cover"></Image>
          <EditContainer
            onClick={() => {
              callback ? callback() : null
            }}
            style={style}
          >
            <EditIcon height={30} width={30} />
          </EditContainer>
        </PhotoContainer>
      ) : (
        <UploadContainer
          ref={avatarRef}
          width={width}
          height={height}
          style={style}
          onClick={() => {
            callback ? callback() : null
          }}
        >
          <IconContainer>
            <AddIcon color={colors.gray2} width={30} height={30} />
            <Text color={colors.gray2} size={15} weight={700}>
              Choose File
            </Text>
          </IconContainer>
        </UploadContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

const UploadContainer = styled.div<{ width: string; height: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => (p.width ? p.width + "px" : "100%")};
  height: ${(p) => (p.height ? p.height + "px" : "100%")};
  border: 2px solid ${colors.gray4};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  & > div {
    border-radius: 10px !important;
  }
  &:hover {
    opacity: 0.8;
  }
`

const PhotoContainer = styled.div<{ width: string; height: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: ${colors.gray5};
  width: ${(p) => (p.width ? p.width + "px" : "100%")};
  height: ${(p) => (p.height ? p.height + "px" : "100%")};
  overflow: hidden;
`

const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
