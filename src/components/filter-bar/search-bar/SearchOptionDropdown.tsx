import { ComponentProps } from "react"

import styled from "@emotion/styled"

import { Dropdown } from "components/ui"

import { SearchOptionGroup, SearchOptionItem } from "./OptionList"

interface SearchOptionGroupItem {
  name: string
  list: SearchOptionItem[]
}

interface Props extends Omit<ComponentProps<typeof Dropdown>, "children"> {
  value: string[]
  onToggleItem: (value: string) => void
  options: SearchOptionGroupItem[]
}

export function SearchOptionDropdown({
  value,
  onToggleItem,
  options,
  ...rest
}: Props) {
  return (
    <StyledDropdown {...rest}>
      {options.map((group, i) => (
        <SearchOptionGroup
          key={group.name + i}
          name={group.name}
          value={value}
          onToggleItem={onToggleItem}
          list={group.list}
        />
      ))}
    </StyledDropdown>
  )
}

const StyledDropdown = styled(Dropdown)`
  padding: 24px;
  width: 600px;
  & > * + * {
    margin-top: 24px;
  }
`
