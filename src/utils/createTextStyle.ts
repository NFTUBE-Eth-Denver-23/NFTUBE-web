import { CSSProperties } from "react"

import clsx from "clsx"

import { colors } from "constants/colors"
import { coerceCssPixelValue } from "utils/css"

import { Typography } from "../components/ui/Text"

export interface TextStyleProps {
  typography?: Typography
  color?: string
  font?: CSSProperties["fontFamily"] | "Gilroy" | "Cereal"
  size?: CSSProperties["fontSize"]
  lineHeight?: CSSProperties["lineHeight"]
  weight?: CSSProperties["fontWeight"]
  center?: boolean
}

export function createTextStyle(props: TextStyleProps) {
  const {
    typography,
    font = "Gilroy",
    size,
    weight,
    lineHeight,
    color = colors.black,
    center,
  } = props
  const style: CSSProperties = {
    color,
    fontFamily: font,
    fontSize: coerceCssPixelValue(size),
    fontWeight: weight,
    lineHeight: coerceCssPixelValue(lineHeight),
    textAlign: center ? "center" : undefined,
    //hides overflow text if maxWidth applied to style
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline-block",
    // whiteSpace: "nowrap",
  }
  const className = clsx({
    [`typography-${typography}`]: !!typography,
  })
  return { style, className }
}
