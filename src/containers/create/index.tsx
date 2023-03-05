import React from "react"

import styled from "@emotion/styled"

import { MainNavbar } from "components/MainNavbar"
import CreateNew from "./new"

export default function CreatePage() {
  return (
    <Container>
      <MainNavbar />
      <CreateNew />
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`
