import React, { ComponentProps, ReactNode } from "react"
import styled from "@emotion/styled"
import clsx from "clsx"

import { AutoSizingTextArea } from "./AutoSizingTextArea"
import { InputLabel } from "./InputLabel"
import { colors } from "constants/colors"
import { Text } from ".."
import { withProps } from "hocs/withProps"

interface Props extends ComponentProps<typeof AutoSizingTextArea> {
  title?: string
  label?: ReactNode
  right?: ReactNode
  style?: Object
}

export function TextArea({
  title,
  label,
  right,
  className,
  style,
  autoResize = true,
  ...rest
}: Props) {
  return (
    <Container>
      {title && (
        <Text size={20} color={colors.black} weight={700}>
          {title}
        </Text>
      )}
      {label && <InputLabel>{label}</InputLabel>}
      <TextAreaContainer style={style}>
        {autoResize ? (
          <StyledAutoSizingTextArea minLength={4} {...rest} />
        ) : (
          <StyledNonAutoSizingTextArea minLength={4} {...rest} />
        )}
        <TextContainer>{right}</TextContainer>
      </TextAreaContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 3px;
`

const TextAreaContainer = styled.div`
  display: flex;
  background-color: transparent;
  justify-content: space-between;
  width: 100%;
  border-radius: 0.75rem;
  border-width: 2px;
  min-height: 100px;
`

const StyledAutoSizingTextArea = styled(AutoSizingTextArea)`
  font-family: Gilroy;
  background-color: transparent;
  color: ${colors.black};
  font-size: 15px;
  line-height: 1.75rem;
  text-align: left;
  width: 100%;
  border: 2px solid ${colors.natural1.color3};
  border-radius: 10px;
  padding: 12px 14px;
`

const StyledNonAutoSizingTextArea = styled(
  withProps(AutoSizingTextArea, {
    autoResize: false,
  })
)`
  font-family: Gilroy;
  background-color: transparent;
  color: ${colors.black};
  font-size: 15px;
  line-height: 1.75rem;
  text-align: left;
  width: 100%;
  border: 2px solid ${colors.natural1.color3};
  border-radius: 10px;
  padding: 12px 14px;
`

const TextContainer = styled.div`
  display: flex;
  margin-left: 0.5rem;
  color: ${colors.black};
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 700;
  justify-content: center;
  width: min-content;
`
