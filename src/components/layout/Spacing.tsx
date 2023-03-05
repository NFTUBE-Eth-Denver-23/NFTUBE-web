import { ComponentProps, memo } from "react"

import { coerceCssPixelValue } from "utils/css"

type SpacingProps = ComponentProps<"div"> & {
  children?: never
  inline?: boolean
} & (
    | { width: string | number }
    | { height: string | number }
    | { flex: number }
  )

export const Spacing = memo(function Spacing(props: SpacingProps) {
  const { style, inline, ...otherProps } = props

  return (
    <div
      style={{
        flex: "flex" in props ? props.flex : "none",
        width: "width" in props ? coerceCssPixelValue(props.width) : undefined,
        height:
          "height" in props ? coerceCssPixelValue(props.height) : undefined,
        display: inline ? "inline-block" : undefined,
        ...style,
      }}
      {...otherProps}
    />
  )
})
