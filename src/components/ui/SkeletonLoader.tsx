import styled from "@emotion/styled"
import { colors } from "constants/colors"
import { keyframes } from "@emotion/react"

export function SkeletonLoader({ ...props }) {
  return (
    <Container {...props}>
      <Indicator />
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 0;
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .4;
  }
`

const Indicator = styled.div`
  width: 100%;
  height: 100%;
  background: ${colors.gray5};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 5px;
`
