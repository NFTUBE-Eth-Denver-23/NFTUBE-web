import React, { ReactNode } from "react"
import Router, { useRouter } from "next/router"

import styled from "@emotion/styled"

import { Spacing } from "components/layout"
import { Tabs, Text } from "components/ui"
import { Tab as BaseTab } from "components/ui/tabs/Tab"
import { colors } from "constants/colors"
import { SIUints } from "utils/format"

import { useCallback } from "react"
import { CollectionType } from "types/Collection"

export function ExploreTabBar({ tab }) {
  const setTab = useCallback((tab: CollectionType) => {
    Router.replace({ pathname: Router.pathname, query: { tab } })
  }, [])

  return (
    <Container>
      <StyledTabs value={tab || CollectionType.ALL} onChange={setTab} indicator>
        <Tab id={CollectionType.ALL} label={"ALL"} />
        <Tab id={CollectionType.ART} label={"ART"} />
        <Tab id={CollectionType.FASHION} label={"FASHION"} />
        <Tab id={CollectionType.DIGITAL} label={"DIGITAL"} />
        <Tab id={CollectionType.CELEBRITY} label={"CELEBRITY"} />
        <Tab id={CollectionType.GAME} label={"GAME"} />
        <Tab id={CollectionType.BRANDS} label={"BRANDS"} />
        <Tab id={CollectionType.COLLECTIBLES} label={"COLLECTIBLES"} />
        <Tab id={CollectionType.SPORTS} label={"SPORTS"} />
        <Tab id={CollectionType.MUSIC} label={"MUSIC"} />
      </StyledTabs>
    </Container>
  )
}

const Container = styled.div`
  border-bottom: 1px solid ${colors.gray3};
`

const StyledTabs = styled(Tabs)`
  max-width: 1265px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

interface TabProps {
  id: string
  label: ReactNode
  count?: number
  disabled?: boolean
}

export function Tab({ label, id, count, disabled }: TabProps) {
  return (
    <BaseTab id={id} disabled={disabled}>
      {() => (
        <ItemContainer>
          <Text weight="bold" size={16} lineHeight={26}>
            {label}
          </Text>
          {count != null && (
            <React.Fragment>
              <Spacing width={4} />
              <Text size={16} lineHeight={26} color={colors.gray3}>
                {SIUints.format(count)}
              </Text>
            </React.Fragment>
          )}
        </ItemContainer>
      )}
    </BaseTab>
  )
}

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 32.5px 8px;
  transition: all 300ms;
`
