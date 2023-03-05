import { ComponentProps, forwardRef, ReactNode, Ref } from "react"

import styled from "@emotion/styled"
import { CheckIcon } from "@heroicons/react/solid"

import { colors } from "constants/colors"

interface Props extends ComponentProps<"input"> {
  label?: ReactNode
  loading?: boolean
}

export const Checkbox = forwardRef(function Checkbox(
  { label, style, loading, ...rest }: Props,
  ref: Ref<HTMLInputElement>
) {
  return (
    <CheckboxContainer style={style}>
      <StyledInput ref={ref} {...rest} type="checkbox" hidden />
      <CheckboxIcon />
      {label}
    </CheckboxContainer>
  )
})

const CheckboxContainer = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  width: 20px;
  height: 20px;
`

const StyledInput = styled.input`
  display: none;
`

function CheckboxIcon() {
  return (
    <CheckboxIconContainer>
      <CheckIcon width={17} color={colors.white} strokeWidth={3} />
    </CheckboxIconContainer>
  )
}

const CheckboxIconContainer = styled.div`
  input[type="checkbox"] + & {
    content: " ";
    display: inline-block;
    line-height: 21px; /* 세로정렬을 위해 높이값과 일치 */
    text-align: center;
    vertical-align: middle;
    border: 1.5px solid ${colors.natural1.color2};
    border-radius: 4px;
    transition: background 0.1s;
    & > * {
      color: rgba(0, 0, 0, 0);
    }
  }
  input[type="checkbox"]:not(:disabled) + & {
    cursor: pointer;
  }
  input[type="checkbox"]:disabled + & {
    border: 1px solid ${colors.natural1.color};
    cursor: not-allowed;
  }
  input[type="checkbox"]:checked + & {
    content: "\\2714";
    & > * {
      color: ${colors.white};
    }
    text-shadow: 1px 1px #fff;
    background: ${colors.primary.color};
    border-color: ${colors.primary.color};
  }
  input[type="checkbox"]:disabled:checked + & {
    background: ${colors.primary.color};
    border-color: ${colors.primary.color};
  }
`
