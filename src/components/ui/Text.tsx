import { createTextStyle, TextStyleProps } from "../../utils/createTextStyle"
import { ElementType, SupportHTMLElementProps } from "./SupportHTMLElementProps"

export enum Typography {
  heading = "h",
  heading1 = "h1",
  heading2 = "h2",
  heading3 = "h3",

  body = "b",

  button = "button",
  button2 = "button2",
}

interface Props<T extends ElementType>
  extends TextStyleProps,
    Omit<SupportHTMLElementProps<T>, "size"> {
  as?: T
}

export function Text<T extends ElementType = "span">({
  typography,
  font,
  size,
  weight,
  lineHeight,
  color,
  center,
  ...props
}: Props<T>) {
  const { style } = createTextStyle({
    font,
    size,
    weight,
    lineHeight,
    color,
    center,
  })
  const Component = ("as" in props ? props.as : "span") as any

  //add rypo check
  return (
    <Component
      {...props}
      style={{
        ...style,
        ...props.style,
      }}
    />
  )
}
