import React, { KeyboardEvent, useRef } from "react"

import styled from "@emotion/styled"

import { SearchIcon } from "components/icons"
import { Spacing } from "components/layout"
import { Input } from "components/ui"
import { colors } from "constants/colors"
import { useBooleanState, useInputState } from "hooks/common"

interface Props {
  value: string[]
  onChange: (keyword: string[]) => void
}

export function SearchBar({ onChange }: Props) {
  const [isOpen, open, close] = useBooleanState(false)
  const [text, onInputChange, setText] = useInputState("")
  const handleEnter = () => {
    close()
    if (!text) {
      return
    }
    onChange([text])
    setText("")
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnter()
    }
  }

  // const handleToggleItem = useDebounce(
  //   (keyword) =>
  //     onChange(
  //       value.includes(keyword)
  //         ? value.filter((i) => i !== keyword)
  //         : [...value, keyword]
  //     ),
  //   50
  // )
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Container ref={containerRef}>
      <Input
        left={
          <React.Fragment>
            <StyledSearchIcon
              size={20}
              color={colors.natural1.color2}
              onClick={handleEnter}
            />
            <Spacing width={12} />
          </React.Fragment>
        }
        placeholder="Search Bored Ape Yacht"
        onChange={onInputChange}
        onKeyUp={handleKeyPress}
        value={text}
        onClick={open}
      />
      {/* <SearchOptionDropdown
        open={isOpen}
        onClose={close}
        value={value}
        onToggleItem={handleToggleItem}
        parent={containerRef}
        options={[
          { name: "Collections", list: MOCK_SEARCH_OPTIONS },
          // { name: "Singles", list: MOCK_SEARCH_OPTIONS2 },
        ]}
      /> */}
    </Container>
  )
}

const Container = styled.div`
  flex: 1.5;
`

const StyledSearchIcon = styled(SearchIcon)`
  cursor: pointer;
`
