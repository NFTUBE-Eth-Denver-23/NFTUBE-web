import styled from "@emotion/styled"

import { Spacing } from "components/layout"
import { Text } from "components/ui"
import { colors } from "constants/colors"

import { OptionItem } from "./OptionItem"

interface Props {
  name: string
  value: string[]
  onToggleItem: (value: string) => void
  list: SearchOptionItem[]
}

export interface SearchOptionItem {
  name: string
  imageUrl: string
}

export function SearchOptionGroup({ name, list, value, onToggleItem }: Props) {
  return (
    <div>
      <Text color={colors.gray3}>{name}</Text>
      <Spacing height={12} />
      <Container>
        {list.map((item, i) => (
          <OptionItem
            key={item.name + i}
            name={item.name}
            imageUrl={item.imageUrl}
            checked={value.includes(item.name)}
            onClick={() => onToggleItem(item.name)}
          />
        ))}
      </Container>
    </div>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`
