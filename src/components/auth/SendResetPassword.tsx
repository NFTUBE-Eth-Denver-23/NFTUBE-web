import { Dispatch, KeyboardEventHandler, SetStateAction, useState } from "react"

import styled from "@emotion/styled"
import { Input, Spacing, Text } from "components/ui"
import BackIcon from "components/icons/BackIcon"
import Button, { TextButton } from "components/ui/Buttons"
import { colors } from "constants/colors"
import { AuthState } from "./index"
import { useInputState } from "hooks/common"
import { cognitoSendPasswordReset } from "src/services/cognito"
import { useMutation } from "react-query"
import { Toast } from "components/ui/Toast"
import { validateEmail } from "./validate"

interface ResetPasswordProps {
  setState: Dispatch<SetStateAction<AuthState>>
  state: AuthState
  close: () => void
}

function ResetPassword({ close, setState, state }: ResetPasswordProps) {
  const [email, onEmailChange] = useInputState("")

  const { mutate, isLoading } = useMutation(
    ["password_reset"],
    async () => {
      const cognitoResponse = await cognitoSendPasswordReset(email)

      if (cognitoResponse?.code) {
        throw Error(cognitoResponse)
      }
    },
    {
      onSuccess: () => {
        Toast.success("Successfully sent reset email!")
        close()
      },
      onError: (error: any) => {
        const message = error.message.split(":").at(-1)
        console.log("failed sendPasswordReset: ", message)
        Toast.error(message)
      },
    }
  )

  const onSendReset = async () => {
    if (validateEmail(email)) {
      mutate()
    }
  }

  const handleKeyPress: KeyboardEventHandler = (e: any) => {
    if (e.key === "Enter") {
      onSendReset()
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
          Reset Password
        </Text>
      </TitleContainer>

      <Text weight={500} size={18} color={colors.gray2}>
        Please enter your email to receive a reset link!
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
      <Spacing height={5} />
      <Button loading={isLoading} onClick={onSendReset}>
        Send
      </Button>
      <Spacing height={15} />
      <Text weight={500} size={16} color={colors.gray2}>
        Remember your password?
      </Text>
      <TextButton weight={600} onClick={() => setState(AuthState.SIGN_IN)}>
        Log in
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

export default ResetPassword
