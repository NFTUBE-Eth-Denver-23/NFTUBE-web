import {
  ComponentProps,
  CSSProperties,
  ForwardedRef,
  ReactNode,
  useState,
  useRef,
} from "react"
import React from "react"

import styled from "@emotion/styled"
import { CubeIcon } from "@heroicons/react/outline"

import { Spacing } from "components/layout"
import { Text, Typography } from "components/ui"
import { chains } from "constants/chains"
import { colors } from "constants/colors"
import { useChainId } from "hooks/useChainId"
import { coerceCssPixelValue } from "utils/css"
import { CardInfoTab } from "components/InfoTab"
import Video from "components/ui/Video"

interface Props extends ComponentProps<typeof Container> {
  header: ReactNode
  name: string
  footer?: ReactNode
  attributes?: Object
  hideHover?: boolean
  width?: number
  disabled?: boolean
}

export const CommonCard = Object.assign(
  React.forwardRef(function CommonCard(
    {
      children,
      name,
      header,
      footer,
      attributes,
      hideHover,
      width,
      disabled,
      ...rest
    }: Props,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    return (
      <Container
        disabled={disabled}
        style={{ maxWidth: width }}
        hideHover={hideHover}
        {...rest}
        ref={ref}
      >
        <ContentContainer>{header}</ContentContainer>
        {footer ? (
          <FooterContainer>{footer}</FooterContainer>
        ) : (
          <FooterContainer>
            <Text
              style={{
                maxWidth: "100%",
              }}
              weight={700}
              color={colors.black}
            >
              {name}
            </Text>
            <Spacing height={10} />
            {Boolean(attributes) && (
              <AttributeContainer>
                {Object.entries(attributes).map(([key, value], i) => (
                  <CardInfoTab key={i} title={key} content={value} />
                ))}
              </AttributeContainer>
            )}
            {children}
          </FooterContainer>
        )}
      </Container>
    )
  }),
  {
    Image,
  },
  {
    Video,
  }
)

const Container = styled.div<{ hideHover?: boolean; disabled?: boolean }>`
  opacity: ${(p) => (p.disabled ? "0.5" : "1")};
  border: 1px solid ${colors.gray5};
  border-radius: 10px;
  cursor: pointer;
  transition: transform 300ms;
  &:hover {
    transform: ${(p) => (p.hideHover || p.disabled ? "" : "translateY(-2px)")};
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

interface ImageProps extends ComponentProps<typeof ImageContainer> {
  name?: string
  url?: string
}

function Image({ name, url, ...props }: ImageProps) {
  return (
    <ImageContainer {...props}>
      <RectangleImageContainer>
        {url ? (
          <StyledImage src={url} alt={name} />
        ) : (
          <Center style={{ background: colors.gray5 }}>
            {/* <CubeIcon
              width="30%"
              color={colors.gray4}
              style={{ opacity: 0.5, marginBottom: 20 }}
            /> */}
          </Center>
        )}
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

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
// interface VideoProps extends ComponentProps<typeof ImageContainer> {
//   url?: string
// }
// function Video({ url, width, height, ...props }: VideoProps) {
//   const [play, setPlay] = useState(false)

//   function togglePlay() {
//     setPlay((current) => !current)
//   }

//   return (
//     <VideoContainer width={width} height={height}>
//       {url ? (
//         <video width="100%" height="100%" controls>
//           <source src={url} type="video/mp4" />
//           <source src={url} type="video/ogg" />
//           <source src={url} type="video/mov" />
//           Your browser does not support the video tag.
//         </video>
//       ) : (
//         <Center style={{ background: colors.gray5 }} />
//       )}
//       {/* <ControllerBox>
//         <ControllButton onClick={togglePlay}/>
//       </ControllerBox> */}
//       {props.children}
//     </VideoContainer>
//   )
// }

// const VideoContainer = styled.div<{
//   width?: CSSProperties["width"]
//   height?: CSSProperties["height"]
// }>`
//   position: relative;
//   overflow: hidden;
//   border-radius: 10px;
//   width: ${(p) => coerceCssPixelValue(p.width)};
//   height: ${(p) => coerceCssPixelValue(p.height ?? p.width)};
// `
// const ControllerBox = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.2);
//   display: flex;
//   align-items: center;
//   transition: all 0.5s ease;
//   opacity: 0;
//   &:hover {
//     opacity: 1;
//   }
// `
// const ControllButton = styled.button`
//   width: 100px;
//   height: 100px;
//   background-color: tomato;
//   border-radius: 50%;
// `

// //todo
// //1. file size limitation
// //2. custom video controller
