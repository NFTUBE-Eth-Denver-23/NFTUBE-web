import { useCallback, useState } from "react"

export function useArray<T>(defaultValue: T[] = []) {
  const [value, setValue] = useState<T[]>(defaultValue)

  const add = useCallback((item: T) => {
    setValue((prev) => [...prev, item])
  }, [])

  const remove = useCallback((item: T) => {
    setValue((prev) => prev.filter((i) => i !== item))
  }, [])

  const toggleItem = useCallback((item: T) => {
    setValue((prev) => {
      if (prev.some((i) => i === item)) {
        return prev.filter((i) => i !== item)
      } else {
        return [...prev, item]
      }
    })
  }, [])
  return { value, add, remove, toggleItem }
}
