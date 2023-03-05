import React, { ComponentProps, ForwardedRef, ReactNode } from "react"

import styled from "@emotion/styled"

import { colors } from "constants/colors"

import { InputLabel } from "./InputLabel"
import { withTextStyle } from "hocs/withText"
import { ErrorLabel } from "./ErrorLabel"
import { Spacing } from ".."
import { Text } from ".."

interface Props extends ComponentProps<"input"> {
  error?: string
  title?: string
  value?: string | number
  label?: ReactNode
  left?: ReactNode
  right?: ReactNode
}

export const Input = React.forwardRef(function Input(
  { title, label, value, left, right, error, type, ...rest }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <Container>
      {title && (
        <Text size={20} color={colors.black} weight={700}>
          {title}
        </Text>
      )}
      {label && <InputLabel>{label}</InputLabel>}
      <InputContainer error={error}>
        {left}
        {left ? <Spacing width={10} /> : null}
        <StyledInput
          type={type}
          value={value}
          min="0"
          size={12}
          placeholder="0.0"
          {...rest}
          ref={ref}
        />
        {right}
      </InputContainer>
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </Container>
  )
})

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3px;
`

const InputContainer = styled.div<{ error?: string }>`
  flex: 1;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid ${colors.natural1.color3};
  border-radius: 10px;
  position: relative;
  ${(p) => (p.error ? `border-color: ${colors.red}` : "")}
`

const StyledInput = styled(
  withTextStyle("input", {
    font: "Gilroy",
    weight: 500,
    size: 15,
    lineHeight: 24,
  })
)`
  min-width: 0px;
  flex: 1;
  border: none;
  background: none;
`
