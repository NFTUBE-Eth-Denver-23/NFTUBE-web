import { colors } from "constants/colors"

import { Text } from "../Text"

export function ErrorLabel({ children }) {
  return (
    <Text weight="600" size={15} lineHeight={24} color={colors.red}>
      {children}
    </Text>
  )
}
