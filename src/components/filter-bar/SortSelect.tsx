import { Select } from "components/ui"

export function SortSelect({
  value,
  onChange,
}: {
  value: SortType
  onChange: (value: SortType) => void
}) {
  return (
    <Select
      options={Object.keys(SortType).map((id: SortType) => ({
        id,
        name: LABEL_BY_TYPE[id],
      }))}
      value={LABEL_BY_TYPE[value]}
      onChange={(value) => onChange(value.id)}
      placeholder="Sort By"
    />
  )
}
export enum SortType {
  HOT = "HOT",
  RECENT = "RECENT",
  MOST_SCANNED = "MOST_SCANNED",
}

const LABEL_BY_TYPE = {
  [SortType.HOT]: "Hot",
  [SortType.RECENT]: "Most recent",
  [SortType.MOST_SCANNED]: "Most scanned",
}
