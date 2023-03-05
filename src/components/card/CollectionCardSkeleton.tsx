import React from "react"

import styled from "@emotion/styled"

import { Spacing } from "components/layout"
import { SkeletonLoader } from "components/ui"
import { CommonCardSkeleton } from "./CommonCardSkeleton"

export function CollectionCardSkeleton() {
  return (
    <CommonCardSkeleton
      header={
        <Container>
          <CommonCardSkeleton.Image width={390} height={190} />
          <Spacing width={4} />
        </Container>
      }
      attributes={2}
    />
  )
}

const Container = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`
