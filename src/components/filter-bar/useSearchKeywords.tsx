import { useCallback } from "react"

import { useRouter } from "next/router"

import { QS } from "utils/url"

export function useSearchKeywords() {
  const rawKeywords = QS.get("keywords")
  const keywords = rawKeywords ? rawKeywords.split(",") : []
  const router = useRouter()
  const set = useCallback((keywords: string[]) => {
    router.replace(
      `${router.basePath}${QS.create({
        ...QS.getData(),
        keywords: keywords.length ? keywords.join(",") : undefined,
      })}`
    )
  }, [])
  return { value: keywords, set }
}
