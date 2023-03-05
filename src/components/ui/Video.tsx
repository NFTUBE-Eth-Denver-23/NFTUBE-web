import styled from "@emotion/styled"
import { CSSProperties, VideoHTMLAttributes } from "react"
import { coerceCssPixelValue } from "utils/css"

export interface VideoProps extends VideoHTMLAttributes<any> {
  src: string
  layout?: string
  objectFit?: CSSProperties["objectFit"]
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
}
function Video({
  src,
  objectFit,
  width,
  height,
  layout = "intrinsic",
  ...props
}: VideoProps) {
  return (
    <VideoContainer layout={layout}>
      <Vid objectFit={objectFit} width="100%" height="100%" controls {...props}>
        <source src={src} type="video/mp4" />
        <source src={src} type="video/ogg" />
        <source src={src} type="video/mov" />
        Your browser does not support the video tag.
      </Vid>
    </VideoContainer>
  )
}
const Vid = styled.video<{ objectFit?: CSSProperties["objectFit"] }>``
const VideoContainer = styled.div<{
  layout: string
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
}>`
  position: relative;
  ${({ layout, width, height }) =>
    layout === "fill"
      ? {
          width: "100%",
          height: "100%",
        }
      : layout === "fixed"
      ? {
          width: coerceCssPixelValue(width),
          height: coerceCssPixelValue(height),
        }
      : {
          width: coerceCssPixelValue(width),
          height: coerceCssPixelValue(height),
        }};
`

export default Video

//todo
// intrinsice style
