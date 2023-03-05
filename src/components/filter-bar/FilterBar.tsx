import { useState } from "react"

import styled from "@emotion/styled"

import { Spacing } from "components/layout"

// import { SortType, SortSelect } from "./SortSelect"
import { SearchBar } from "./search-bar"
import { SearchResultControl } from "./SearchResultControl"
import { useSearchKeywords } from "./useSearchKeywords"

export function FilterBar() {
  // const [filter, setFilter] = useState([])
  // const [order, setOrder] = useState<SortType>()
  const keywords = useSearchKeywords()

  return (
    <Container>
      <CenterVertical>
        <SearchResultControl
          keywords={keywords.value}
          onChange={keywords.set}
        />
        <Spacing width={16} />
        <Spacing flex={1} />
        <SearchBar onChange={keywords.set} value={keywords.value} />
        <Spacing width={16} />
        {/* <SortSelect value={order} onChange={setOrder} /> */}
      </CenterVertical>
    </Container>
  )
}

const Container = styled.div`
  padding: 12px 24px;
  max-width: 1248px;
  margin: 0 auto;
`

const CenterVertical = styled.div`
  display: flex;
  align-items: center;
`
