export function commaizeNumber(
  value: string | number,
  options?: { decimals: number }
) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: options?.decimals ?? 8,
  })
}
