import styled from "@emotion/styled"
import XIcon from "components/icons/XIcon"
import React from "react"
import ModalComponent from "react-modal"

const defaultStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 100ms ease-in-out",
    zIndex: 1,
  },
  content: {
    border: "0",
    borderRadius: "10px",
    bottom: "auto",
    left: "50%",
    top: "50%",
    padding: "2rem",
    position: "fixed",
    right: "auto",
    transform: "translate(-50%,-50%)",
    width: "auto",
    zIndex: 2,
  },
}

interface Props {
  children: React.ReactNode
  open: boolean
  style?: {
    overlay: Object
    content: Object
  }
  onClose: () => void
}

export function Modal({ children, style, open, onClose }: Props) {
  return (
    <ModalComponent
      closeTimeoutMS={100}
      isOpen={open}
      onRequestClose={onClose}
      style={{ ...defaultStyle, ...style }}
    >
      <XButtonContainer>
        <XButton onClick={onClose}>
          <XIcon />
        </XButton>
        {children}
      </XButtonContainer>
    </ModalComponent>
  )
}

const XButtonContainer = styled.span`
  position: relative;
  width: 100%;
  height: 100%;
`

const XButton = styled.span`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

export default Modal
