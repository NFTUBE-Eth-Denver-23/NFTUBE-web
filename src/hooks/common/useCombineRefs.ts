import { Ref, useCallback, MutableRefObject, RefCallback } from "react"

export function useCombineRefs<T>(
  ...refs: Array<Ref<T> | RefCallback<T> | undefined>
): (value: T) => void {
  return useCallback(
    (value: T) => {
      for (const ref of refs.filter((ref) => ref != null)) {
        if (typeof ref === "function") {
          ref(value)
        } else if (ref != null) {
          ;(ref as MutableRefObject<T>).current = value
        }
      }
    },
    [refs]
  )
}
