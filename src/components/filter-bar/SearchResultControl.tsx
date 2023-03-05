import React from "react"

import styled from "@emotion/styled"
import { XIcon } from "@heroicons/react/solid"

import { RefreshIcon } from "components/icons"
import { Spacing } from "components/layout"
import { Text } from "components/ui"
import { colors } from "constants/colors"
import { SIUints } from "utils/format"

interface Props {
  count?: number
  keywords: string[]
  onChange: (keywords: string[]) => void
}

export function SearchResultControl({ count = 0, keywords, onChange }: Props) {
  if (!keywords.length) {
    return <React.Fragment />
  }

  return (
    <Container>
      <RefreshButton count={count} onClick={() => onChange([])} />
      <Spacing width={27} />
      <KeywordListContainer>
        {keywords.map((keyword, i) => (
          <KeywordBox
            key={keyword + i}
            onClick={() => onChange(keywords.filter((i) => i !== keyword))}
          >
            {keyword}
          </KeywordBox>
        ))}
      </KeywordListContainer>
      <Spacing width={26} />
      <ClearButton onClick={() => onChange([])} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  overflow-x: auto;
`

function RefreshButton({
  count,
  onClick,
}: {
  count: number
  onClick: () => void
}) {
  return (
    <ButtonContainer onClick={onClick}>
      <RefreshIcon size={24} color={colors.black} />
      <Spacing width={8} />
      <Text weight="500" size={15} lineHeight={24}>
        {SIUints.format(count)} Results
      </Text>
    </ButtonContainer>
  )
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <ButtonContainer onClick={onClick}>
      <Text weight="500" color={colors.black} size={15} lineHeight={24}>
        Clear All
      </Text>
    </ButtonContainer>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const KeywordListContainer = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 17px;
  }
`

function KeywordBox({
  children,
  onClick,
}: {
  children: string
  onClick: () => void
}) {
  return (
    <KeywordContainer onClick={onClick}>
      <Text weight="500" size={15} lineHeight={24}>
        {children}
      </Text>
      <Spacing width={8} />
      <XIcon width={20} />
    </KeywordContainer>
  )
}

const KeywordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 14px;
  background: ${colors.natural1.color4};
  border-radius: 10px;
  cursor: pointer;
  transition: background 300ms;
  &:hover {
    background: ${colors.natural1.color3};
  }
`
