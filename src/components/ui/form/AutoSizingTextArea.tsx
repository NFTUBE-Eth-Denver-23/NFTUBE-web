import React, {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react"

import styled from "@emotion/styled"

import { useCombineRefs, useMounted } from "hooks/common"

type Props = ComponentProps<"textarea"> & {
  autoResize?: boolean
}

export const AutoSizingTextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ autoResize = true, ...props }, forwardRef) {
    const ref = useRef<HTMLTextAreaElement>(null)
    const resize = useCallback(() => {
      if (ref.current == null || !autoResize) {
        return
      }
      ref.current.style.height = "auto"
      const { paddingTop, paddingBottom } = window.getComputedStyle(ref.current)
      const padding = parseInt(paddingTop) + parseInt(paddingBottom)
      const resultHeight = ref.current.scrollHeight - padding
      if (resultHeight === 0) {
        return
      }
      ref.current.style.height = `${resultHeight}px`
    }, [autoResize])
    const combinedRef = useCombineRefs(ref, forwardRef, resize)

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        resize()
        props.onChange?.(e)
      },
      [props.onChange, resize]
    )

    const isMounted = useMounted()

    useEffect(() => {
      if ((props.value != null || props.defaultValue != null) && isMounted) {
        resize()
      }
    }, [props.value, props.defaultValue, resize, isMounted])

    return (
      <StyledTextArea
        {...props}
        rows={props.rows ?? 1}
        ref={combinedRef}
        onChange={handleChange}
        spellCheck={false}
      />
    )
  }
)

const StyledTextArea = styled.textarea`
  box-shadow: none !important;
  padding: 0;
  flex: 1;
  outline: none;
  border: none;
  &:focus {
    outline: none;
  }
  resize: none;
  appearance: none;
`
