export function coerceCssPixelValue(value: string | number) {
  if (!value || typeof value === "string") {
    return value
  }
  return `${value}px`
}
