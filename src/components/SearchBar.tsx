import React, { KeyboardEvent } from "react"

import styled from "@emotion/styled"

import { SearchIcon } from "components/icons"
import { Spacing } from "components/layout"
import { Input } from "components/ui"
import { colors } from "constants/colors"
import { useInputState } from "hooks/common"

interface Props {
  onEnter: (keyword: string) => void
}

export function SearchBar({ onEnter }: Props) {
  const [text, onChange, setText] = useInputState("")
  const handleEnter = () => {
    if (!text) {
      return
    }
    onEnter(text)
    setText("")
  }

  const handleHeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnter()
    }
  }

  return (
    <Container>
      <Input
        left={
          <React.Fragment>
            <StyledSearchIcon
              size={20}
              color={colors.gray1}
              onClick={handleEnter}
            />
            <Spacing width={12} />
          </React.Fragment>
        }
        placeholder="Search items, collections, and accounts"
        onChange={onChange}
        onKeyUp={handleHeyPress}
        value={text}
      />
    </Container>
  )
}

const Container = styled.div`
  flex: 1.5;
`

const StyledSearchIcon = styled(SearchIcon)`
  cursor: pointer;
`
