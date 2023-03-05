import { ComponentProps } from "react"

import styled from "@emotion/styled"

import { Spacing } from "components/layout"
import { Checkbox, Text } from "components/ui"
import { colors } from "constants/colors"

interface ItemProps
  extends Omit<ComponentProps<typeof ItemContainer>, "onChange"> {
  imageUrl: string
  name: string
  checked?: boolean
  onChange?: (checked?: boolean) => void
}

export function OptionItem({
  imageUrl,
  name,
  checked,
  onChange,
  ...rest
}: ItemProps) {
  return (
    <ItemContainer onClick={() => onChange?.(!checked)} {...rest}>
      <Checkbox checked={checked} />
      <Spacing width={20} />
      <Logo src={imageUrl} />
      <Spacing width={12} />
      <Text color={colors.black}>{name}</Text>
    </ItemContainer>
  )
}
const ItemContainer = styled.label`
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: opacity 300ms;
  &:active {
    opacity: 0.85;
  }
`
const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 10px;
`
