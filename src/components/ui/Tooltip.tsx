import React, { ForwardedRef, ReactNode } from "react"

import { PortalConsumer } from "providers/PortalProvider"
import styled from "@emotion/styled"
import { colors } from "constants/colors"

interface Props {
  position: { x: string; y: string }
  children: ReactNode
}

export const Tooltip = React.forwardRef(function Tooltip(
  { position, children }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <PortalConsumer>
      <Container
        style={{ left: position.x, top: position.y, zIndex: 20 }}
        ref={ref}
      >
        {children}
      </Container>
    </PortalConsumer>
  )
})

const Container = styled.div`
  position: fixed;
  padding: 0.5rem;
  color: ${colors.black};
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
`
