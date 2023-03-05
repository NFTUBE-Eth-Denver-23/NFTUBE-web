import { CSSProperties } from "react"

import styled from "@emotion/styled"

import { coerceCssPixelValue } from "utils/css"

export const Divider = styled.div<{
  height?: CSSProperties["height"]
  width?: CSSProperties["width"]
  color: CSSProperties["backgroundColor"]
  marginHorizontal?: CSSProperties["marginTop"]
  marginVertical?: CSSProperties["marginLeft"]
}>`
  width: ${(p) => coerceCssPixelValue(p.width ?? "1px")};
  min-width: ${(p) => coerceCssPixelValue(p.width ?? "1px")};
  height: ${(p) => coerceCssPixelValue(p.height ?? "1px")};
  min-height: ${(p) => coerceCssPixelValue(p.height ?? "1px")};
  background-color: ${(p) => p.color};
  ${(p) =>
    p.marginVertical
      ? `
    margin-top: ${coerceCssPixelValue(p.marginVertical)};
    margin-bottom: ${coerceCssPixelValue(p.marginVertical)};
  `
      : ""};
  ${(p) =>
    p.marginHorizontal
      ? `
    margin-left: ${coerceCssPixelValue(p.marginHorizontal)};
    margin-right: ${coerceCssPixelValue(p.marginHorizontal)};
  `
      : ""};
`
