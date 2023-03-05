import styled from "@emotion/styled"

import { colors } from "constants/colors"
import Image from "next/image"
import EditIcon from "./icons/EditIcon"

interface Props {
  onChange?: () => void
  src?: string
}

export function CoverPhoto({ onChange, src }: Props) {
  return (
    <CoverPhotoContainer>
      {src ? <Image src={src} layout="fill" objectFit="cover" /> : null}
      {onChange ? (
        <EditContainer onClick={onChange}>
          <EditIcon height={30} width={30} />
        </EditContainer>
      ) : null}
    </CoverPhotoContainer>
  )
}

const CoverPhotoContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 250px;
  margin-bottom: 30px;
  background-color: ${colors.gray5};
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
