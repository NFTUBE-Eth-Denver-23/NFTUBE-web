import styled from "@emotion/styled"

import { Divider, Spacing, Text } from "components/ui"
import { colors } from "constants/colors"

interface Props {
  steps: string[]
  step: number
  setStep: (step: number) => void
}
export function StepSection({ steps, step, setStep }: Props) {
  return (
    <Container>
      <Spacing height={28} />
      <CenterVertical>
        {steps.map((text, idx, arr) => (
          <CenterVertical key={text + idx}>
            <Text
              weight={700}
              size={18}
              lineHeight={24}
              color={idx <= step ? colors.primary.color : colors.gray3}
              // onClick={() => (idx < step ? setStep(idx) : null)}
              // style={{
              //   cursor: idx < step ? "pointer" : "default",
              // }}
            >
              {text}
            </Text>
            {idx < arr.length - 1 && (
              <Divider
                width={28}
                height={2}
                color={idx <= step ? colors.primary.color : colors.gray3}
                marginHorizontal={20}
              />
            )}
          </CenterVertical>
        ))}
      </CenterVertical>
      <Spacing height={28} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CenterVertical = styled.div`
  display: flex;
  align-items: center;
`
