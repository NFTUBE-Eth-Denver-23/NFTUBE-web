import { colors } from "constants/colors"

import { Text } from "../Text"

export function InputLabel({ children }) {
  return (
    <Text weight="600" size={15} lineHeight={24} color={colors.natural1.color2}>
      {children}
    </Text>
  )
}
