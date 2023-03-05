// import { FilterBar } from "./nft-filter-bar"
import { ExploreTabBar } from "components/explore-tab-bar/ExploreTabBar"
import { MainNavbar } from "components/MainNavbar"
import { CollectionType } from "components/explore-tab-bar"
import { FilterBar } from "components/filter-bar"
import styled from "@emotion/styled"
import List from "./List"
import { useMounted } from "hooks/common"

export default function Explore({ tab }: { tab?: string }) {
  const mounted = useMounted()
  if (!mounted) return null
  return (
    <Container>
      <MainNavbar />
      <ExploreTabBar tab={tab} />
      <FilterBar />
      <ContentContainer>
        {(tab === CollectionType.ALL || !tab) && <List tab={tab} />}
        {tab === CollectionType.ART && <List tab={tab} />}
        {tab === CollectionType.FASHION && <List tab={tab} />}
        {tab === CollectionType.DIGITAL && <List tab={tab} />}
        {tab === CollectionType.CELEBRITY && <List tab={tab} />}
        {tab === CollectionType.GAME && <List tab={tab} />}
        {tab === CollectionType.BRANDS && <List tab={tab} />}
        {tab === CollectionType.COLLECTIBLES && <List tab={tab} />}
        {tab === CollectionType.SPORTS && <List tab={tab} />}
        {tab === CollectionType.MUSIC && <List tab={tab} />}
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
`

const ContentContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 30px;
`
