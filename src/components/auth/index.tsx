import { useCallback, useState } from "react"

import { useModal } from "hooks/useModal"
import Auth from "./Auth"
import EmailSignin from "./EmailSignin"
import EmailSignup from "./EmailSignup"
import SendResetPassword from "./SendResetPassword"

export function useAuthDialog() {
  const { open, close } = useModal()
  return useCallback(() => {
    open(<AuthModal close={close} />)
  }, [open, close])
}

export enum AuthState {
  SIGN_IN,
  SIGN_UP,
  EMAIL_SIGN_IN,
  EMAIL_SIGN_UP,
  PASSWORD_RESET,
}

function AuthModal({ close }) {
  const [state, setState] = useState(AuthState.SIGN_IN)

  return (
    <span>
      {state == AuthState.SIGN_IN || state == AuthState.SIGN_UP ? (
        <Auth state={state} setState={setState} />
      ) : state == AuthState.EMAIL_SIGN_IN ? (
        <EmailSignin close={close} state={state} setState={setState} />
      ) : state == AuthState.EMAIL_SIGN_UP ? (
        <EmailSignup close={close} state={state} setState={setState} />
      ) : (
        <SendResetPassword close={close} state={state} setState={setState} />
      )}
    </span>
  )
}
