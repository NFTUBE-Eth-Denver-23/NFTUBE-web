import { useEffect } from "react"

import { isIOS } from "utils/env"

import { useCallbackRef } from "./useCallbackRef"

export function useWindowResizeEvent(
  handler: (event: UIEvent) => void,
  options?: EventListenerOptions
) {
  useWindowEvent("resize", handler, options)
}

export function useWindowScrollEvent(
  handler: (event: UIEvent) => void,
  options?: EventListenerOptions
) {
  useWindowEvent("scroll", handler, options)
}

export function useWindowEvent<E extends Event>(
  eventName: string,
  handler: (event: E) => void,
  options?: EventListenerOptions
) {
  const preservedHandler = useCallbackRef(handler)

  useEffect(() => {
    const target = isIOS() ? window.visualViewport : window
    target?.addEventListener(eventName, preservedHandler, options)
    return () => {
      target?.removeEventListener(eventName, preservedHandler, options)
    }
  }, [eventName, preservedHandler])
}
