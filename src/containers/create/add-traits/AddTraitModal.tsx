import styled from "@emotion/styled"
import { useCallback, useState } from "react"

import { useModal } from "hooks/useModal"
import { Input, Text } from "components/ui"
import Button from "components/ui/Buttons"
import { colors } from "constants/colors"

export function useAddTraitDialog() {
  const { open, close } = useModal()
  return useCallback(
    ({ callback }: { callback: (value: string) => void }) => {
      open(<AddTraitModal onClose={close} callback={callback} />)
    },
    [open]
  )
}

function AddTraitModal({
  onClose,
  callback,
}: {
  onClose: () => void
  callback: (value: string) => void
}) {
  const [trait, setTrait] = useState<string>("")
  return (
    <Container>
      <Text weight={700} size={25}>
        Add a Trait
      </Text>
      <Text weight={600} size={17} color={colors.gray2}>
        Add a trait for this collection. (ex. Eyes, Hairstyle)
      </Text>
      <Input
        value={trait}
        onChange={(e) => {
          setTrait(e.target.value)
        }}
        placeholder="Trait Name"
      />
      <Button
        onClick={() => {
          callback(trait)
          onClose()
        }}
      >
        Add
      </Button>
    </Container>
  )
}

const Container = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`
