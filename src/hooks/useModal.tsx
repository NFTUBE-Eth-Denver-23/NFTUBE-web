import React, { ReactNode, useCallback, useMemo, useState } from "react"

import Modal from "components/ui/Modal"

interface ModalContext {
  isOpen: boolean
  close: () => void
  open: (children: ReactNode) => void
}

export const ModalContext = React.createContext<ModalContext | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(<></>)

  const close = useCallback(() => setIsOpen(false), [])
  const open = useCallback((children: ReactNode) => {
    setContent(children)
    setIsOpen(true)
  }, [])

  const value = useMemo(() => ({ isOpen, close, open }), [isOpen, close, open])

  return (
    <ModalContext.Provider value={value}>
      <>
        {children}
        <Modal open={isOpen} onClose={close}>
          {content}
        </Modal>
      </>
    </ModalContext.Provider>
  )
}

export function useModal() {
  return React.useContext(ModalContext)
}

export default useModal
