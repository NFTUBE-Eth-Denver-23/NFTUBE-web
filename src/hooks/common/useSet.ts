import { useCallback, useMemo, useState } from "react"

export function useSet<T>() {
  const [keywords, setKeywords] = useState(new Set<T>())

  const add = useCallback((keyword: T) => {
    setKeywords((prev) => {
      const next = new Set(prev.values())
      next.add(keyword)
      return next
    })
  }, [])

  const remove = useCallback((keyword: T) => {
    setKeywords((prev) => {
      const next = new Set(prev.values())
      next.delete(keyword)
      return next
    })
  }, [])

  const set = useCallback((keywords: T[]) => {
    setKeywords(new Set(keywords))
  }, [])

  const toggle = useCallback((keyword: T) => {
    setKeywords((prev) => {
      const next = new Set(prev.values())
      if (prev.has(keyword)) {
        next.delete(keyword)
      } else {
        next.add(keyword)
      }
      return next
    })
  }, [])

  const value = useMemo(() => Array.from(keywords), [keywords])

  return { value, add, remove, set, toggle }
}
