import { ChangeEventHandler, Dispatch, useCallback, useState } from "react"

import { useCallbackRef } from "./useCallbackRef"

type Handler = ChangeEventHandler<{ value: string }>

type Options<T> = {
  transform: (value: string) => T
  onChange?: (value: T) => void
}

export function useInputState<T = string>(
  initialValue: T,
  options?: Options<T>
): [T, Handler, Dispatch<T>]
export function useInputState(
  initailValue: string | undefined
): [string, Handler, Dispatch<string>]
export function useInputState(
  initialValue: unknown,
  options: Options<unknown> = { transform: String }
) {
  const [value, setValue] = useState(initialValue)
  const transform = options?.transform
  const onChange = useCallbackRef(options.onChange)

  const handleValueChange: ChangeEventHandler<{ value: string }> = useCallback(
    (e) => {
      const value = e.target.value
      const newValue = transform ? transform(value) : value
      setValue(newValue)
      onChange(newValue)
    },
    [transform, onChange]
  )

  return [value, handleValueChange, setValue] as const
}
