import React, { ReactElement, ReactNode } from "react"

import styled from "@emotion/styled"
import { animated, useSpring } from "react-spring"

export function SwipeContainer({
  page,
  children,
}: {
  page: number
  children: ReactElement[]
}) {
  return (
    <StyledContainer>
      <AnimatedContainer page={page}>{children}</AnimatedContainer>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  width: 100%;
  overflow: hidden;
  flex: 1;
`

function AnimatedContainer({
  page,
  children,
}: {
  page: number
  children: ReactElement[]
}) {
  const value = useSpring({
    x: `${page * -100}%`,
  })
  return (
    <StyledAnimatedContainer style={{ translateX: value.x }}>
      {children.map((child, i) => (
        <PageContainer key={i}>{child}</PageContainer>
      ))}
    </StyledAnimatedContainer>
  )
}
const StyledAnimatedContainer = styled(animated.div)`
  display: -webkit-box;
  height: 100%;
`

function PageContainer({ children }: { children: ReactNode }) {
  return <StyledPageContainer>{children}</StyledPageContainer>
}

const StyledPageContainer = styled.div`
  width: 100vw;
  height: 100%;
`
