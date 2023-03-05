import { Toast } from "components/ui/Toast"
import { URLFormatResultType } from "hooks/common/useURLFormatInput"

export const validateURLsFormat = (
  resultList: Array<URLFormatResultType>,
  preventMessageBubbling: boolean = false
): boolean => {
  for (const res of resultList) {
    const { name, result } = res
    if (!result) {
      if (!preventMessageBubbling) {
        Toast.error(`${name} link is not url format.`)
      }
      return false
    }
  }
  return true
}
