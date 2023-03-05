import { ComponentProps, useCallback } from "react"

import styled from "@emotion/styled"
import { ChevronDownIcon } from "@heroicons/react/outline"

import { colors } from "constants/colors"
import { useBooleanState } from "hooks/common"

import { Dropdown } from "../Dropdown"
import { Text, Typography } from "../Text"
import { Input } from "./Input"
import { InputLabel } from "./InputLabel"

interface OptionItem<T extends string> {
  id: T
  name: string
}

interface Props<T extends string, Item extends OptionItem<T>>
  extends Omit<ComponentProps<typeof Input>, "onChange"> {
  options?: Item[]
  title?: string
  label?: string
  listHeight?: number
  onChange?: (value: Item) => void
}

export function Select<T extends string, Item extends OptionItem<T>>({
  title,
  label,
  options,
  onChange,
  listHeight,
  ...props
}: Props<T, Item>) {
  const [isOpen, open, close] = useBooleanState(false)
  const hasOptions = Boolean(options?.length)
  const handleSelectItem = useCallback(
    (value: Item) => {
      onChange?.(value)
      close()
    },
    [onChange, close]
  )

  return (
    <Container>
      {title && (
        <Text size={20} color={colors.black} weight={700}>
          {title}
        </Text>
      )}
      {label && <InputLabel>{label}</InputLabel>}
      <label>
        <StyledInput
          {...props}
          id="combobox"
          role="combobox"
          aria-controls="options"
          aria-expanded="false"
          autoComplete="off"
          disabled={!hasOptions}
          className={props.className}
          onClick={open}
          onFocus={open}
          onBlur={close}
          right={<ChevronDownIcon width={24} color={colors.gray3} />}
        />
      </label>
      <Dropdown open={isOpen && hasOptions} onClose={close}>
        <List height={listHeight}>
          {options?.map((item, i) => (
            <ItemContainer
              key={item.id + i}
              onClick={() => handleSelectItem(item)}
            >
              <Text typography={Typography.body}>{item.name}</Text>
              {item.id === props.value && <CheckIcon />}
            </ItemContainer>
          ))}
        </List>
      </Dropdown>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  gap: 3px;
`

const List = styled.ul<{ height: number }>`
  list-style-type: none;
  padding: 0;
  height: ${(p) => p.height}px;
`

const StyledInput = styled(Input)`
  cursor: pointer;
`

const ItemContainer = styled.li`
  position: relative;
  padding: 13px 16px 14px;
  cursor: pointer;
  transition: background 300ms;
  &:hover {
    background: ${colors.natural1.color4};
  }
`

function CheckIcon() {
  return (
    <CheckIconContainer>
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        />
      </svg>
    </CheckIconContainer>
  )
}

const CheckIconContainer = styled.span`
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding-right: 1rem;
  color: ${colors.primary.color};
  align-items: center;
`
