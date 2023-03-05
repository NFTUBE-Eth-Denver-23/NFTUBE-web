import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"

import { Spacing } from "components/layout"
import { BrowsingChain } from "components/browsing-chain"
import { SearchBar } from "components/SearchBar"
import { NavigationItem } from "types/index"
import { Media } from "utils/css"

import { CreateButton } from "./CreateButton"
import { colors } from "constants/colors"

import { LazyComponentWithPreloadFactory } from "utils/LazyComponentWithPreload"

interface Props {
  navigations: NavigationItem[]
}

const editPageLoader = () => import("../../../pages/create/new")
const _CreatePage = LazyComponentWithPreloadFactory(editPageLoader)
export function NavBar({ navigations }: Props) {
  const { asPath, push } = useRouter()

  const preload = (component) => {
    component.preload()
  }

  return (
    <Navbar>
      <Link href="/" passHref>
        <LogoWrapper>
          <Logo src="/images/nftube.svg" width="50px" height="30px" />
          <Spacing width={"4px"} />
          <LogoName>
            <NavText>NFTUBE</NavText>
          </LogoName>
        </LogoWrapper>
      </Link>
      <Spacing width={"24px"} />
      <SearchBarContainer>
        <SearchBar
          onEnter={(text) => {
            push(`/explore?tab=all&keywords=${text}`)
          }}
        />
      </SearchBarContainer>
      <Spacing flex={1} />
      <NavItem>
        {navigations
          .map((item) => ({ ...item, isCurrent: asPath === item.href }))
          .map((item, i) => (
            <Link key={item.name + i} href={item.href}>
              <NavText>{item.name}</NavText>
            </Link>
          ))}
      </NavItem>
      <RightCcontainer>
        <BrowsingChain />
        <CreateButton onMouseEnter={() => preload(_CreatePage)} />
      </RightCcontainer>
    </Navbar>
  )
}

const Navbar = styled.nav`
  height: 76px;
  background: #ffffff;
  display: flex;
  padding: 0 36px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0px;
  z-index: 1;
  border-bottom: 1px solid ${colors.gray5};
`

const NavText = styled.a`
  display: block;
  &:hover {
    color: ${colors.primary.color};
  }
`

const Logo = styled.img`
  width: 36px;
  height: 20px;
  align-items: center;
`
const LogoName = styled.div`
  font-family: "Gilroy";
  font-weight: 700;
  font-size: 18px;
  color: black;
  line-height: 130%;
  left: 80px;
  top: 27px;
  align-items: center;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: all 500ms ease;
  display: none;
  ${Media.screen("lg")("display: block;")}
`
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    /* Hover: color change */
    div {
      color: ${colors.primary.color};
    }
  }
`

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 3;
  max-width: 600px;
  display: none;
  ${Media.screen("sm")("display: block;")}
`

const NavItem = styled.div`
  font-family: "Gilroy";
  font-size: 15px;
  font-weight: 800;
  line-height: 130%;
  display: flex;
  width: 180px;
  justify-content: space-between;
  align-items: center;
  margin-right: 30px;
  left: 60%;
  transition: all 500ms ease;
  cursor: pointer;
  /* Screen halved */
  @media (max-width: 1470px) {
    display: none;
  }
`
const RightCcontainer = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 12px;
  }
`
