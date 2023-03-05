import { DefaultValue, atom } from "recoil"
import { safeLocalStorage } from "utils/storage"
import { DEFAULT_CHAIN_ID } from "constants/index"

const defaultBrowsingChainId = DEFAULT_CHAIN_ID

const localForageEffect = (key: string) => ({ setSelf, onSet }) => {
  const savedValue = safeLocalStorage.get(key)
  setSelf(
    savedValue != null ? parseInt(savedValue) : new DefaultValue() // Abort initialization if no value was stored
  )

  // Subscribe to state changes and persist them to localForage
  onSet((newValue: any, _: any, isReset: any) => {
    isReset
      ? safeLocalStorage.remove(key)
      : safeLocalStorage.set(key, newValue.toString())
  })
}

export const browsingChainState = atom({
  key: "browsing_chain_state",
  default: defaultBrowsingChainId,
  effects: [localForageEffect("current_browsing_chain")],
})
