import React, { CSSProperties, useEffect, useRef, useState } from "react"

import styled from "@emotion/styled"
import jazzicon from "@metamask/jazzicon"

import { colors } from "constants/colors"
import Image from "next/image"
import EditIcon from "./icons/EditIcon"
import UserIcon from "./icons/UserIcon"
import { useMounted } from "hooks/common"

interface Props {
  onChange?: () => void
  src?: string
  id?: string
  size?: number
  style?: CSSProperties
}

export function ProfilePhoto({ onChange, id, src, style, size = 40 }: Props) {
  const avatarRef = useRef()
  const mounted = useMounted()

  useEffect(() => {
    const element = avatarRef.current as HTMLDivElement
    if (id && mounted) {
      const addr = id.slice(2, 10)
      const seed = parseInt(addr, 16)
      const icon = jazzicon(size, seed)
      if (element.firstChild) {
        element.removeChild(element.firstChild)
      }
      element.appendChild(icon)
    }
  }, [id, avatarRef, size, mounted])

  if (!mounted) return null

  return id ? (
    <DefaultContainer size={size}>
      <DefaultProfileContainer ref={avatarRef}></DefaultProfileContainer>
      {onChange ? (
        <EditContainer onClick={onChange} style={style}>
          <EditIcon height={30} width={30} />
        </EditContainer>
      ) : null}
    </DefaultContainer>
  ) : // <div></div>
  src ? (
    <ProfilePhotoContainer size={size} style={style}>
      <Image src={src} layout="fill"></Image>
      {onChange ? (
        <EditContainer onClick={onChange} style={style}>
          <EditIcon height={30} width={30} />
        </EditContainer>
      ) : null}
    </ProfilePhotoContainer>
  ) : (
    <AnonButton style={style}>
      <UserIcon width={size} height={size} color={colors.gray2} />
    </AnonButton>
  )
}

const DefaultContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: ${(p) => p.size}px;
  overflow: hidden;
  & > div {
    border-radius: ${(p) => p.size}px !important;
  }
`

const DefaultProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  & > div {
    border-radius: 50% !important;
  }
`

const ProfilePhotoContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  overflow: hidden;
  border-radius: 50%;
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
