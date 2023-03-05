import { useRef } from "react"

import styled from "@emotion/styled"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"

import { useBooleanState } from "hooks/common"

import { ProfilePhoto } from "components/ProfilePhoto"
import { useUser } from "hooks/useAuth"
import { ProfileDropdown } from "./ProfileDropdown"

export function ProfileButton({ ...rest }) {
  const [isOpen, open, close, toggle] = useBooleanState()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const { user } = useUser()

  return (
    <div ref={profileRef} {...rest}>
      <Profile ref={dropdownRef}>
        <ButtonContainer onClick={toggle}>
          {user?.profilePhoto ? (
            <ProfilePhoto src={user.profilePhoto} />
          ) : user?.userId ? (
            <ProfilePhoto id={user.userId} />
          ) : (
            <ProfilePhoto />
          )}
          <Image
            src="/images/chevron_down.svg"
            alt="Chevron drop down"
            layout="fixed"
            width={24}
            height={24}
          />
        </ButtonContainer>
      </Profile>
    </div>
  )
}

const Profile = styled.div`
  display: flex;
  text-align: center;
  vertical-align: middle;
  align-items: center;
  cursor: pointer;
`

const ButtonContainer = styled.div`
  display: flex;
  text-align: center;
  vertical-align: middle;
  align-items: center;
`
