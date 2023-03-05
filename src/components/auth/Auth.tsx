import { Dispatch, ReactNode, SetStateAction } from "react"

import styled from "@emotion/styled"
import { Divider, Text } from "components/ui"
import { TextButton } from "components/ui/Buttons"
import { colors } from "constants/colors"
import Image from "next/image"
import { AuthState } from "./index"
import { withOAuth } from "aws-amplify-react"

interface AuthProps {
  setState: Dispatch<SetStateAction<AuthState>>
  state: AuthState
  googleSignIn: any
}

function Auth(props: AuthProps) {
  const { googleSignIn, setState, state } = props
  return (
    <Container>
      <Text weight={700} size={30}>
        {state == AuthState.SIGN_IN ? "Sign In" : "Sign Up"}
      </Text>

      <Text weight={500} size={18} color={colors.gray2}>
        {state == AuthState.SIGN_IN
          ? "Log in with your social account"
          : "Sign up with your social account"}
      </Text>

      <AuthContainer>
        <SocialLogin
          title="Email"
          // subtext="Popular"
          onClick={() =>
            state == AuthState.SIGN_IN
              ? setState(AuthState.EMAIL_SIGN_IN)
              : setState(AuthState.EMAIL_SIGN_UP)
          }
        >
          <Image src="/icons/email.svg" width={30} height={30} />
        </SocialLogin>
        {/* <Divider height={1} color={colors.gray4} width="100%" />
        <SocialLogin title="Twitter" subtext="Popular" onClick={() => {}}>
          <Image src="/icons/twitter.svg" width={30} height={30} />
        </SocialLogin> */}
        <Divider height={1} color={colors.gray4} width="100%" />
        <SocialLogin
          title="Google"
          subtext="Coming Soon"
          onClick={googleSignIn}
        >
          <Image src="/icons/google.svg" width={30} height={30} />
        </SocialLogin>
        {/* <Divider height={1} color={colors.gray4} width="100%" />
        <SocialLogin title="Apple" onClick={() => {}}>
          <Image src="/icons/apple.svg" width={30} height={30} />
        </SocialLogin> */}
      </AuthContainer>

      <Text weight={500} size={16} color={colors.gray2}>
        {state == AuthState.SIGN_IN
          ? "Don't have an account?"
          : "Already have an account?"}
      </Text>
      <TextButton
        onClick={() => {
          state == AuthState.SIGN_IN
            ? setState(AuthState.SIGN_UP)
            : setState(AuthState.SIGN_IN)
        }}
        weight={600}
      >
        {state == AuthState.SIGN_IN ? "Sign Up" : "Sign In"}
      </TextButton>
    </Container>
  )
}

interface SocialLoginProps {
  title: string
  subtext?: string
  children: ReactNode
  onClick: () => void
}

function SocialLogin({ title, subtext, children, onClick }: SocialLoginProps) {
  return (
    <SocialLoginContainer onClick={onClick}>
      <SocialContainer>
        {children}
        <Text weight={500} size={15}>
          {title}
        </Text>
      </SocialContainer>
      {subtext ? (
        <Popular>
          <Text size={15} color={colors.white}>
            {subtext}
          </Text>
        </Popular>
      ) : null}
    </SocialLoginContainer>
  )
}

const AuthContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d2d3d4;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 20px;
  margin: 20px 0px;
  gap: 12px;
`

const Container = styled.div`
  max-width: 400px;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`

const SocialLoginContainer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const SocialContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const Popular = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 15px;
  gap: 20px;
  width: auto;
  height: 20px;
  background: ${colors.primary.color};
  border-radius: 10px;
`

export default withOAuth(Auth)
