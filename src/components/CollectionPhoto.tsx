import { CSSProperties, useRef } from "react"

import styled from "@emotion/styled"
import { UserIcon } from "@heroicons/react/solid"

import { colors } from "constants/colors"
import Image from "next/image"
import EditIcon from "./icons/EditIcon"

interface Props {
  onChange?: () => void
  src?: string
  size?: number
  style?: CSSProperties
}

export function CollectionPhoto({ onChange, src, style, size = 40 }: Props) {
  return src ? (
    <CollectionPhotoContainer size={size} style={style}>
      <Image src={src} layout="fill"></Image>
      {onChange ? (
        <EditContainer onClick={onChange} style={style}>
          <EditIcon height={30} width={30} />
        </EditContainer>
      ) : null}
    </CollectionPhotoContainer>
  ) : (
    <AnonButton size={size} style={style}>
      <UserIcon width={"70%"} color={colors.gray2} />
    </AnonButton>
  )
}

const DefaultProfileContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  overflow: hidden;
  &:hover {
    opacity: 0.8;
  }
`

const CollectionPhotoContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  overflow: hidden;
  border-radius: 10px;
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

const AnonButton = styled(DefaultProfileContainer)`
  justify-content: center;
  background: ${colors.white};
`
