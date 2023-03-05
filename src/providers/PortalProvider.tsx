import React, { createContext, ReactNode, useState } from "react"

import { createPortal } from "react-dom"

export const PortalContext = createContext<HTMLDivElement | null>(null)

export function PortalProvider({ children }: { children: ReactNode }) {
  const [portalContainerRef, setPortalContainerRef] =
    useState<HTMLDivElement | null>(null)

  return (
    <PortalContext.Provider value={portalContainerRef}>
      {children}
      <div
        id="portal-container"
        ref={(el) => {
          if (portalContainerRef !== null || el === null) {
            return
          }

          setPortalContainerRef(el)
        }}
      />
    </PortalContext.Provider>
  )
}

export function PortalConsumer({ children }: { children: ReactNode }) {
  return (
    <PortalContext.Consumer>
      {(portalContainerRef) => {
        if (portalContainerRef === null) {
          return null
        }

        return createPortal(children, portalContainerRef)
      }}
    </PortalContext.Consumer>
  )
}
