import React, { ComponentProps, ForwardedRef } from "react"

import styled from "@emotion/styled"
import clsx from "clsx"

export const RangeInput = React.forwardRef(function RangeInput(
  props: ComponentProps<typeof StyledRangeInput>,
  ref: ForwardedRef<HTMLInputElement>
) {
  return <StyledRangeInput {...props} type="range" ref={ref} />
})

const StyledRangeInput = styled.input`
  margin-bottom: 15px;
  height: 0.5px;
  -webkit-appearance: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: pointer;
    height: 20px;
    width: 20px;
    border-radius: 20px;
    background: linear-gradient(90.79deg, #6948ee 0%, #eb48ee 107.3%);
  }
`
