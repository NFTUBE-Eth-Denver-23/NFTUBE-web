import React from "react"

import styled from "@emotion/styled"

import { Spacing } from "components/layout"
import { CommonCardSkeleton } from "./CommonCardSkeleton"

export function NFTCardSkeleton() {
  return (
    <CommonCardSkeleton
      header={
        <Container>
          <CommonCardSkeleton.Image width={222} height={190} />
          <Spacing width={4} />
        </Container>
      }
      attributes={1}
    />
  )
}

const Container = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`
