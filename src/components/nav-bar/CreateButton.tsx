import styled from "@emotion/styled"
import Link from "next/link"

import { Media } from "utils/css"

export function CreateButton({ ...rest }) {
  return (
    <Button {...rest}>
      <ChainInfo>
        <Link href="/create/new" passHref>
          <CreateText>Create</CreateText>
        </Link>
      </ChainInfo>
    </Button>
  )
}

const Button = styled.button`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.1px;
  line-height: 130%;
  border-radius: 30px;
  background: #2a2c33;
  border: none;
  height: 45px;
  display: none;
  ${Media.screen("sm")(`
    display: flex;
    align-items: center;
  `)}
`
const ChainInfo = styled.div`
  display: flex;
  text-align: center;
  vertical-align: middle;
  align-items: center;
  padding: 0 24px;
`
const CreateText = styled.span`
  display: inline-block;
  color: white;
`
