import {
  ComponentProps,
  CSSProperties,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import styled from "@emotion/styled"

import { colors } from "constants/colors"
import {
  useWindowEvent,
  useWindowResizeEvent,
  useWindowScrollEvent,
} from "hooks/common"
import { PortalConsumer } from "providers/PortalProvider"

interface Props extends ComponentProps<"div"> {
  open?: boolean
  onClose?: () => void
  children: ReactNode
  parent?: RefObject<HTMLElement>
}

export function Dropdown({ open, onClose, children, parent, ...props }: Props) {
  const containerRef = useRef<HTMLDivElement | null>()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const layout = useDropdownLayout(open, parent || containerRef, dropdownRef)
  const preventBlur = useCallback((e) => e.preventDefault(), [])
  useWindowEvent(
    "mousedown",
    (e: MouseEvent) => {
      if (!onClose) {
        return
      }
      const target = e.target as HTMLElement
      const parent2 = parent?.current ?? containerRef.current
      const container = dropdownRef.current
      if (
        parent2?.contains(target) ||
        parent2?.isSameNode(target) ||
        container?.contains(target) ||
        container?.isSameNode(target)
      ) {
        e.stopPropagation()
        e.preventDefault()
        return
      }
      onClose()
    },
    { capture: true }
  )

  return (
    <div ref={containerRef}>
      <PortalConsumer>
        {open && (
          <DropdownContainer
            ref={dropdownRef}
            onMouseDown={preventBlur}
            {...props}
            style={{ ...layout, ...props.style }}
          >
            {children}
          </DropdownContainer>
        )}
      </PortalConsumer>
    </div>
  )
}

const DropdownContainer = styled.div`
  position: fixed;
  z-index: 10;
  margin-top: 2px;
  overflow: auto;
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0px 0px 60px 4px rgba(0, 0, 0, 0.1);
`

function useDropdownLayout(
  use?: boolean,
  containerRef?: RefObject<HTMLElement>,
  contentRef?: RefObject<HTMLElement>
) {
  const [layout, setLayout] = useState<CSSProperties>({})

  const updateLayout = useCallback(() => {
    if (!containerRef?.current || use === false || !contentRef?.current) {
      return
    }
    const rect = containerRef.current.getBoundingClientRect()
    const rect2 = contentRef.current.getBoundingClientRect()
    const maxX = window.innerWidth
    const x1 = rect.x + rect2.width + 24
    const left = maxX >= x1 ? rect.x : maxX - 24 - rect2.width
    setLayout({
      left,
      top: rect.top + rect.height,
      minWidth: rect.width,
    })
  }, [use])
  useWindowResizeEvent(updateLayout)
  useWindowScrollEvent(updateLayout, { capture: true })
  useEffect(() => {
    updateLayout()
  }, [use])
  return layout
}
