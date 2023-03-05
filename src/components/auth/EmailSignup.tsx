import React, {
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useState,
} from "react"

import styled from "@emotion/styled"
import { Input, Spacing, Text } from "components/ui"
import BackIcon from "components/icons/BackIcon"
import Button, { TextButton } from "components/ui/Buttons"
import { colors } from "constants/colors"
import { AuthState } from "./index"
import { useInputState } from "hooks/common"
import EyeIcon, { EyeClosedIcon } from "components/icons/EyeIcon"
import { cognitoSignIn, cognitoSignUp } from "src/services/cognito"
import { useMutation } from "react-query"
import { Toast } from "components/ui/Toast"
import { useUser } from "hooks/useAuth"
import { saveUser } from "api/users"
import { validateEmail, validatePassword, validateUserTag } from "./validate"

interface EmailSignupProps {
  setState: Dispatch<SetStateAction<AuthState>>
  state: AuthState
  close: () => {}
}

function EmailSignup({ close, setState, state }: EmailSignupProps) {
  const [userTag, onUserTagChange] = useInputState("")
  const [email, onEmailChange] = useInputState("")
  const [password, onPasswordChange] = useInputState("")
  const [showPassword, setShowPassword] = useState(false)
  const { setUser } = useUser()

  const { mutate, isLoading } = useMutation(
    ["email_sign_up"],
    async () => {
      const { userSub } = await cognitoSignUp(email, password)
      const cognitoResponse = await cognitoSignIn(email, password)

      if (cognitoResponse?.code) {
        throw Error(cognitoResponse)
      }

      const accessToken =
        cognitoResponse?.signInUserSession.accessToken.jwtToken
      const user = {
        userId: userSub,
        userTag,
        description: "",
        socialLinks: {},
        accessToken,
      }
      const res = await saveUser({
        user,
      })

      setUser(user)

      return res
    },
    {
      onSuccess: () => {
        close()
        Toast.success("Sign up success!")
      },
      onError: (error: any) => {
        const message = error.message.split(":").at(-1)
        console.log("failed cognitoSignUp: ", message)
        Toast.error(message)
      },
    }
  )

  const onSignup = async () => {
    if (
      (await validateUserTag(userTag)) &&
      validateEmail(email) &&
      validatePassword(password)
    ) {
      mutate()
    }
  }

  const handleKeyPress: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter") {
      onSignup()
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
          Sign up with email
        </Text>
      </TitleContainer>

      <Text weight={500} size={18} color={colors.gray2}>
        Use your email to sign up!
      </Text>
      <Spacing height={10} />
      <Input
        size={20}
        label="Name Tag"
        placeholder="(ex. 0x_NFTube)"
        onChange={onUserTagChange}
        onKeyUp={handleKeyPress}
        value={userTag}
      />
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
      <Button loading={isLoading} onClick={onSignup}>
        Sign up
      </Button>
      <Spacing height={15} />
      <Text weight={500} size={16} color={colors.gray2}>
        Already have an account??
      </Text>
      <TextButton onClick={() => setState(AuthState.SIGN_IN)} weight={600}>
        Back to sign in
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

export default EmailSignup
