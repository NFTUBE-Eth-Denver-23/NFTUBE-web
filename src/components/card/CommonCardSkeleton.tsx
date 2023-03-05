import { ComponentProps, CSSProperties, ForwardedRef, ReactNode } from "react"
import React from "react"

import styled from "@emotion/styled"
import { colors } from "constants/colors"
import { coerceCssPixelValue } from "utils/css"
import { Spacing } from "components/layout"
import { CardInfoTabSkeleton } from "components/InfoTab"
import { SkeletonLoader } from "components/ui"

interface Props extends ComponentProps<typeof Container> {
  header?: ReactNode
  footer?: ReactNode
  attributes?: number
}

export const CommonCardSkeleton = Object.assign(
  React.forwardRef(function CommonCardSkeleton(
    { header, footer, attributes, ...rest }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    return (
      <Container {...rest} ref={ref}>
        <ContentContainer>{header}</ContentContainer>
        {footer ? (
          <FooterContainer>{footer}</FooterContainer>
        ) : (
          <FooterContainer>
            <SkeletonLoader
              style={{
                width: 50,
                height: 15,
                position: "relative",
              }}
            />
            <Spacing height={10} />
            {Boolean(attributes) && (
              <AttributeContainer>
                {Array.from(Array(attributes).keys()).map((key, i) => (
                  <CardInfoTabSkeleton key={key + i} />
                ))}
              </AttributeContainer>
            )}
          </FooterContainer>
        )}
      </Container>
    )
  }),
  {
    Image,
  }
)

const Container = styled.div`
  border: 1px solid ${colors.gray5};
  border-radius: 10px;
  cursor: pointer;
  transition: transform 300ms;
  &:hover {
    transform: translateY(-2px);
  }
`

const ContentContainer = styled.div`
  padding: 4px;
`

const FooterContainer = styled.div`
  padding: 12px 12px 20px;
`

const AttributeContainer = styled.div`
  display: flex;
  & > * {
    flex: 1;
  }
`

function Image({ ...props }: ComponentProps<typeof ImageContainer>) {
  return (
    <ImageContainer {...props}>
      <RectangleImageContainer>
        <SkeletonLoader />
      </RectangleImageContainer>
      {props.children}
    </ImageContainer>
  )
}

const RectangleImageContainer = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  & > * {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`

const ImageContainer = styled.div<{
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
}>`
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  width: ${(p) => coerceCssPixelValue(p.width)};
  height: ${(p) => coerceCssPixelValue(p.height ?? p.width)};
`
