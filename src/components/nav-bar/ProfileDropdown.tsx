import React, { FunctionComponent } from "react"

import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { RefObject } from "react"

import { Dropdown, Spacing, Text } from "components/ui"

import Button from "components/ui/Buttons"
import { useAuthDialog } from "components/auth"
import { cognitoSignOut } from "src/services/cognito"

import { User } from "types/User"
import { useUser } from "hooks/useAuth"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"

import { switchToChain, switchToDefaultChain } from "utils/walletHelpers"
import { shortenAddress } from "utils/format/shortenAddress"
import { useWalletConnectorDialog } from "components/wallet/WalletConnector"
import { useQuery } from "react-query"
import { queryWalletByUserIdAndChain } from "api/wallets"
import { useBrowsingChain } from "hooks/useBrowsingChain"
import { REACT_LOADABLE_MANIFEST } from "next/dist/shared/lib/constants"
import { isSupportedChain } from "constants/chains"

interface ProfileDropdownProps {
  user: User
  open: boolean
  onClose?: () => void
  trigger: RefObject<HTMLDivElement | null>
}

export const ProfileDropdown: FunctionComponent<ProfileDropdownProps> = ({
  user,
  open,
  onClose,
  trigger,
}) => {
  const openAuth = useAuthDialog()
  const { setUser } = useUser()
  const router = useRouter()

  return (
    <Dropdown open={open} onClose={onClose} parent={trigger}>
      <Container>
        {!user?.userId ? (
          <React.Fragment>
            <Username>Sign In / Sign Up</Username>
            <Spacing height={14} />
            <Button
              style={{
                height: 40,
              }}
              onClick={() => {
                onClose()
                openAuth()
              }}
            >
              Sign In
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Username>Wallet</Username>
            <Spacing height={14} />
            <ConnectButton
              style={{
                height: 40,
              }}
              callback={onClose}
            />
          </React.Fragment>
        )}
        {user?.userId && (
          <React.Fragment>
            <Divider />
            <DropdownItem>
              <Link href={`/profile`}>
                <LinkText>My Profile</LinkText>
              </Link>
            </DropdownItem>
          </React.Fragment>
        )}
        <Divider />
        {/**TODO: Change links to respective pages*/}
        <DropdownItem>
          <Link href="/">
            <LinkText>About Us</LinkText>
          </Link>
        </DropdownItem>
        {user?.userId && (
          <React.Fragment>
            <Divider />
            <DropdownItem
              onClick={async () => {
                // disconnect()
                await cognitoSignOut()
                setUser({})
                onClose()
                router.replace("/")
              }}
            >
              <LinkText>Log out</LinkText>
            </DropdownItem>
          </React.Fragment>
        )}
      </Container>
    </Dropdown>
  )
}

function ConnectButton({
  style,
  callback,
}: {
  style?: Object
  callback?: () => void
}) {
  const { account, active, error, chainId } = useWeb3React()
  const openWalletConnector = useWalletConnectorDialog()
  const { user } = useUser()
  const { browsingChainId } = useBrowsingChain()
  const { push } = useRouter()

  const { data: walletData } = useQuery(
    user.userId && ["query_wallet", user.userId],
    async () => {
      return await queryWalletByUserIdAndChain({
        userId: user.userId,
        chainId: browsingChainId,
      })
    }
  )

  const isSavedWallet =
    account && walletData?.toLowerCase() == account.toLowerCase()

  const isChainValid = active
    ? isSupportedChain(chainId)
    : error instanceof UnsupportedChainIdError
    ? false
    : true

  const isOnBrowsingChain = browsingChainId == chainId

  return (
    <React.Fragment>
      <Text size={15}>Your wallet: {shortenAddress(walletData, 4)}</Text>
      <Spacing height={7}></Spacing>
      {!walletData ? (
        <Button
          style={style}
          onClick={() => {
            push("/profile/edit/wallet")
          }}
        >
          Set Up Wallet
        </Button>
      ) : !active ? (
        <Button
          style={style}
          onClick={() => {
            openWalletConnector()
            callback ? callback() : null
          }}
        >
          Connect Wallet
        </Button>
      ) : !isChainValid || !isOnBrowsingChain ? (
        <Button
          style={style}
          onClick={() => {
            if (!isChainValid) {
              switchToDefaultChain()
            } else if (!isOnBrowsingChain) {
              switchToChain(browsingChainId)
            }
            callback ? callback() : null
          }}
        >
          Switch Chain
        </Button>
      ) : !isSavedWallet ? (
        <Button
          style={style}
          onClick={() => {
            openWalletConnector()
            callback ? callback() : null
          }}
        >
          Unlinked Wallet
        </Button>
      ) : (
        <Button
          style={style}
          onClick={() => {
            openWalletConnector()
            callback ? callback() : null
          }}
        >
          Connected
        </Button>
      )}
    </React.Fragment>
  )
}

const Username = styled.div`
  display: flex;
  font-family: Gilroy;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  align-items: center;
`

const Container = styled.div`
  width: 248px;
  padding: 24px 14px;
`

const DropdownItem = styled.div`
  font-family: Gilroy;
  display: flex;
  align-items: center;
  padding: 6px 0;
  /* Hover: color change */
  cursor: pointer;
  &:hover {
    color: #7b61ff;
  }
  -webkit-transition: all 500ms ease;
  -moz-transition: all 500ms ease;
  -ms-transition: all 500ms ease;
  -o-transition: all 500ms ease;
  transition: all 500ms ease;
  /* Screen halved */
`

const LinkText = styled.a`
  font-family: Gilroy;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 130%;
`

const Divider = styled.hr`
  margin: 14px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  width: 100%;
`
