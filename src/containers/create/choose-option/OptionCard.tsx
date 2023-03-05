import styled from "@emotion/styled"
import { CheckIcon } from "@heroicons/react/outline"

import { Spacing } from "components/layout"
import { Text } from "components/ui"
import { colors } from "constants/colors"

interface Props {
  checked: boolean
  title: string
  subtitle: string
  description: string
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
}

export function OptionCard({
  checked,
  title,
  subtitle,
  description,
  onClick,
  disabled,
  icon,
}: Props) {
  return (
    <Container
      active={checked}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <CheckIconContainer active={checked}>
        {icon ? icon : <CheckIcon width={20} color={colors.white} />}
      </CheckIconContainer>
      <Text font="Gilroy" weight="700" size={28} lineHeight={38}>
        {title}
      </Text>
      <Spacing height={8} />
      <Text
        font="Gilroy"
        weight="700"
        size={16}
        lineHeight={24}
        color={colors.gray3}
      >
        {subtitle}
      </Text>
      <Spacing height={24} />
      <Text
        font="Gilroy"
        weight="600"
        size={16}
        lineHeight={24}
        color={colors.gray3}
        center
      >
        {description}
      </Text>
    </Container>
  )
}

const Container = styled.div<{
  active?: boolean
  disabled?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 250px;
  padding: 48px;
  position: relative;
  border: 2px solid ${(p) => (p.active ? colors.primary.color : colors.gray4)};
  border-radius: 12px;
  background: ${(p) => (p.active ? "##FAFAFA" : colors.white)};
  cursor: pointer;
  ${(p) =>
    p.disabled
      ? `opacity: 0.4;`
      : `
      transition: transform 300ms;
      &:hover {
        transform: translateY(-5px);
      }
  `}
`

const CheckIconContainer = styled.div<{
  active?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  left: 20px;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  border: 2px solid ${colors.gray5};
  ${(p) => (p.active ? `background: ${colors.primary.color};` : "")}
`
