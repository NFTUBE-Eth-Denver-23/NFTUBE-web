import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { Tooltip } from "components/ui/Tooltip"

const Context = createContext<MutableRefObject<TooltipPair[]> | null>(null)

type TooltipPair = [RefObject<HTMLElement>, ReactNode]

export function TooltipProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<TooltipPair[]>([])
  const { position, content, tooltipRef } = useTooltipPosition(mapRef)

  return (
    <Context.Provider value={mapRef}>
      {children}
      {content && (
        <Tooltip ref={tooltipRef} position={position}>
          {content}
        </Tooltip>
      )}
    </Context.Provider>
  )
}

export function useTooltip<E extends HTMLElement = HTMLElement>(
  message?: ReactNode
) {
  const ref = useRef<E>(null)
  const controls = useContext(Context)

  useEffect(() => {
    if (!message) {
      return
    }
    controls.current = [
      ...controls.current?.filter(([el]) => el !== ref),
      [ref, message],
    ]
    return () => {
      controls.current = controls.current?.filter(([el]) => el !== ref)
    }
  }, [message])

  return ref
}

export function useTooltipPosition(targets: RefObject<TooltipPair[]>) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<ReactNode>()
  const [position, setPosition] = useState({ x: "0", y: "0" })
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const node = e.target as Node
    const target = targets.current?.find(
      ([el]) => node == el.current || el.current?.contains(node)
    )
    if (!target) {
      setContent(undefined)
      return
    }
    setContent(target[1])
    const tooltipRect = tooltipRef.current?.getBoundingClientRect()
    if (tooltipRect == null) {
      return
    }
    const maxLeft = window.innerWidth - tooltipRect.width
    const maxTop = window.innerHeight - tooltipRect.height
    const x = e.clientX + 10
    const y = e.clientY + 10
    setPosition({
      x: `${maxLeft < x ? maxLeft : x}px`,
      y: `${maxTop < y ? maxTop : y}px`,
    })
  }, [])

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return { position, content, tooltipRef } as const
}
