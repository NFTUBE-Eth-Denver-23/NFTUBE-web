import styled from "@emotion/styled"

import { SkeletonLoader, Text } from "components/ui"
import { colors } from "constants/colors"
import { ReactNode } from "react"

interface Props {
  title: string
  content: string | number
  icon?: ReactNode
  onClick?: () => void
}
export default function InfoTab({ title, content, icon, onClick }: Props) {
  return (
    <InfoTabContainer>
      <Content>
        {icon}
        <TextContainer clickable={!!onClick} onClick={onClick}>
          <Text
            color={colors.black}
            size={22}
            style={{ marginLeft: icon ? 10 : 0 }}
          >
            {content}
          </Text>
        </TextContainer>
      </Content>
      <Text color={colors.gray1} size={18}>
        {title}
      </Text>
    </InfoTabContainer>
  )
}

const TextContainer = styled.div<{ clickable: boolean }>`
  cursor: ${(p) => (p.clickable ? "pointer" : "")};
  &: hover {
    transform: ${(p) => (p.clickable ? "translateY(-3px)" : "")};
    // opacity: ${(p) => (p.clickable ? "0.6" : "1")};
    transition: 200ms;
  }
`

const InfoTabContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export function CardInfoTab({ title, content, icon }: Props) {
  return (
    <CardInfoTabContainer>
      <Text color={colors.gray1} size={13}>
        {title}
      </Text>
      <Content>
        {icon}
        <Text
          color={colors.black}
          size={17}
          style={{ marginLeft: icon ? 10 : 0 }}
        >
          {content}
        </Text>
      </Content>
    </CardInfoTabContainer>
  )
}

const CardInfoTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export function CardInfoTabSkeleton() {
  return (
    <CardInfoTabContainer>
      <SkeletonLoader
        style={{
          height: 13,
          width: 80,
          position: "relative",
        }}
      />
      <Content>
        <SkeletonLoader
          style={{
            height: 17,
            width: 100,
            position: "relative",
          }}
        />
      </Content>
    </CardInfoTabContainer>
  )
}
