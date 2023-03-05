import { ComponentProps } from "react"

import styled from "@emotion/styled"

import { colors } from "constants/colors"
import { createTextStyle, TextStyleProps } from "utils/createTextStyle"

import Spinner from "./Spinner"

export type ButtonTheme = "primary" | "dark" | "secondary"

interface Props extends ComponentProps<"button">, TextStyleProps {
  loading?: boolean
  disabled?: boolean
  theme?: ButtonTheme
}

export default function Button(props: Props) {
  const {
    children,
    loading,
    disabled,
    theme = "primary",
    // text props
    typography,
    color = TEXT_COLOR_BY_TYPE[theme],
    font = "Gilroy",
    size = 17,
    lineHeight = 24,
    weight = "700",
    center,
    onClick,
    ...rest
  } = props

  const { style } = createTextStyle({
    typography,
    color,
    font,
    size,
    lineHeight,
    weight,
  })

  return (
    <StyledButton
      {...rest}
      theme={theme}
      disabled={disabled || loading}
      type="submit"
      style={{ ...rest.style, ...style }}
      onClick={onClick}
    >
      {loading && (
        <Spinner
          style={{
            color: theme == "secondary" ? colors.primary.color : colors.white,
            marginRight: 10,
          }}
        />
      )}
      <span>{children}</span>
    </StyledButton>
  )
}

const StyledButton = styled.button<{ theme: ButtonTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${(p) => TEXT_COLOR_BY_TYPE[p.theme]};
  border-radius: 10px;
  border: ${(p) => BORDER_BY_TYPE[p.theme]};
  height: 56px;
  width: 100%;

  transition: opacity 300ms;

  &:disabled,
  &[disabled] {
    opacity: 0.75;
  }

  background: ${(p) => COLOR_BY_TYPE[p.theme]};
  &:hover {
    transform: translateY(-2px);
  }
`

const COLOR_BY_TYPE = {
  primary: colors.primary.color,
  dark: colors.primary.dark,
  secondary: colors.white,
}

const TEXT_COLOR_BY_TYPE = {
  primary: colors.white,
  dark: colors.white,
  secondary: colors.primary.color,
}

const BORDER_BY_TYPE = {
  primary: "none",
  dark: "none",
  secondary: `2px solid ${colors.gray5}`,
}

export function TextButton(props: Props) {
  const {
    children,
    disabled,
    // text props
    typography,
    color = colors.blue,
    font = "Gilroy",
    size = 17,
    lineHeight = 24,
    weight = "700",
    center,
    onClick,
    ...rest
  } = props

  const { style } = createTextStyle({
    typography,
    color,
    font,
    size,
    lineHeight,
    weight,
  })

  return (
    <StyledTextButton
      {...rest}
      disabled={disabled}
      type="submit"
      style={{ ...rest.style, ...style }}
      onClick={onClick}
    >
      <span>{children}</span>
    </StyledTextButton>
  )
}

const StyledTextButton = styled.button`
  border: none;
  padding: 0px;
  background-color: transparent;
  transition: opacity 300ms;
  &:disabled,
  &[disabled] {
    opacity: 0.8;
  }
  &:hover {
    opacity: 0.8;
  }
`
