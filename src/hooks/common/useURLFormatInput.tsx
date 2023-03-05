import { useRef, useState, useEffect, MutableRefObject } from "react"

/**
 * Basically checks input value and checks whether its value is url formmated or not.
 * !!note!! this hook must be used with <HTMLInputElement>
 *
 * @returns {RefObject} ref - ref Object which will be connected to any input component
 */
export type URLFormatResultType = {
  name: string
  result: boolean
}
export type urlFormatRefReturnType = [
  MutableRefObject<HTMLInputElement>,
  URLFormatResultType
]
const useURLFormatInput = (key: string): urlFormatRefReturnType => {
  const ref = useRef<HTMLInputElement | undefined>()
  const [isURL, setIsURL] = useState(true)

  const checkUrlFormat = (e: Event) => {
    let currentValue: string | URL | null = (e.target as HTMLInputElement).value
    try {
      if (currentValue !== "") {
        currentValue = new URL(currentValue)
      }
      setIsURL(true)
    } catch (error) {
      setIsURL(false)
    }
  }
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("input", checkUrlFormat)
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("input", checkUrlFormat)
      }
    }
  }, [])

  return [ref, { name: key, result: isURL }]
}

export default useURLFormatInput
