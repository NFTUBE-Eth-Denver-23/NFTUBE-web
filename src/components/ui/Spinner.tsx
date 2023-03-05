import React from "react"
import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"

export default function Spinner({ ...props }) {
  return (
    <Spin
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></Circle>
      <Path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></Path>
    </Spin>
  )
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spin = styled.svg`
  animation: ${spin} 1s linear infinite;
  color: #ffffff;
  width: 1.25rem;
  height: 1.25rem;
`

const Circle = styled.circle`
  opacity: 0.25;
`

const Path = styled.path`
  opacity: 0.75;
`
