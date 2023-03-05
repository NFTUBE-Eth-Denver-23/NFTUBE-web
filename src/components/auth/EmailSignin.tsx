import { Dispatch, KeyboardEventHandler, SetStateAction, useState } from "react"

import styled from "@emotion/styled"
import { Input, Spacing, Text } from "components/ui"
import BackIcon from "components/icons/BackIcon"
import Button, { TextButton } from "components/ui/Buttons"
import { colors } from "constants/colors"
import { AuthState } from "./index"
import { useInputState } from "hooks/common"
import EyeIcon, { EyeClosedIcon } from "components/icons/EyeIcon"
import { cognitoSignIn } from "src/services/cognito"
import { useMutation } from "react-query"
import { Toast } from "components/ui/Toast"
import { validateEmail, validatePassword } from "./validate"
import { useUser } from "hooks/useAuth"
import { queryUserById } from "api/users"

interface EmailSigninProps {
  setState: Dispatch<SetStateAction<AuthState>>
  state: AuthState
  close: () => void
}

function EmailSignin({ close, setState, state }: EmailSigninProps) {
  const [email, onEmailChange] = useInputState("")
  const [password, onPasswordChange] = useInputState("")
  const [showPassword, setShowPassword] = useState(false)
  const { setUser } = useUser()

  const { mutate, isLoading } = useMutation(
    ["email_sign_in"],
    async () => {
      const cognitoResponse = await cognitoSignIn(email, password)

      if (cognitoResponse?.code) {
        throw Error(cognitoResponse)
      }

      const accessToken =
        cognitoResponse?.signInUserSession.accessToken.jwtToken
      const userId = cognitoResponse?.username

      const user = await queryUserById(userId)

      setUser({
        ...user,
        accessToken,
      })

      return cognitoResponse
    },
    {
      onSuccess: () => {
        Toast.success("Successfully logged in!")
        close()
      },
      onError: (error: any) => {
        const message = error.message.split(":").at(-1)
        console.log("failed cognitoSignIn: ", message)
        Toast.error(message)
      },
    }
  )

  const onSignin = async () => {
    if (validateEmail(email) && validatePassword(password)) {
      mutate()
    }
  }

  const handleKeyPress: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter") {
      onSignin()
    }
  }

  return (
    <Container>
      <TitleContainer>
        <BackButton onClick={() => setState(AuthState.SIGN_IN)}>
          <BackIcon widht={35} height={35} />
        </BackButton>
        <Spacing width={12} />
        <Text weight={700} size={30}>
          Log in with email
        </Text>
      </TitleContainer>

      <Text weight={500} size={18} color={colors.gray2}>
        Use your email to log in!
      </Text>
      <Spacing height={10} />
      <Input
        size={20}
        label="Email"
        placeholder="Email"
        onChange={onEmailChange}
        onKeyUp={handleKeyPress}
        value={email}
      />
      <Input
        size={20}
        label="Password"
        placeholder="Password"
        onChange={onPasswordChange}
        onKeyUp={handleKeyPress}
        value={password}
        type={showPassword ? "text" : "password"}
        right={
          showPassword ? (
            <StyledEyeIcon
              width={20}
              height={20}
              color={colors.gray1}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <StyledEyeClosedIcon
              width={20}
              height={20}
              color={colors.gray1}
              onClick={() => setShowPassword(true)}
            />
          )
        }
      />
      <Spacing height={5} />
      <Button loading={isLoading} onClick={onSignin}>
        Sign in
      </Button>
      <Spacing height={15} />
      <Text weight={500} size={16} color={colors.gray2}>
        Forgot your password?
      </Text>
      <TextButton
        weight={600}
        onClick={() => setState(AuthState.PASSWORD_RESET)}
      >
        Find my password
      </TextButton>
    </Container>
  )
}
const Container = styled.div`
  max-width: 400px;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const BackButton = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`

const StyledEyeIcon = styled(EyeIcon)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

const StyledEyeClosedIcon = styled(EyeClosedIcon)`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

export default EmailSignin
