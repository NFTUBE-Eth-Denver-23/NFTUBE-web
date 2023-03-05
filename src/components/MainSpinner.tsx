import React from "react"
import { css, keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { colors } from "constants/colors"

export default function Spinner({ ...props }) {
  return (
    <Container>
      <First></First>
      <Second></Second>
      <Third></Third>
      <Fourth></Fourth>
    </Container>
  )
}

const ellipsis1 = keyframes`
0% {
  transform: scale(0);
}

100% {
  transform: scale(1);
}
`

const ellipsis3 = keyframes`
0% {
  transform: scale(1);
}

100% {
  transform: scale(0);
}
`

const ellipsis2 = keyframes`
0% {
  transform: translate(0, 0);
}

100% {
  transform: translate(24px, 0);
}
`

const Container = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`

const Circle = styled.div`
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${colors.gray3};
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
`

const First = styled(Circle)`
  left: 8px;
  animation: ${ellipsis1} 0.6s infinite;
`

const Second = styled(Circle)`
  left: 8px;
  animation: ${ellipsis2} 0.6s infinite;
`

const Third = styled(Circle)`
  left: 32px;
  animation: ${ellipsis2} 0.6s infinite;
`

const Fourth = styled(Circle)`
  left: 56px;
  animation: ${ellipsis3} 0.6s infinite;
`
