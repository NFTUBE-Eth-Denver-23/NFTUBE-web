import { DefaultValue, atom } from "recoil"
import { User } from "types/User"
import { safeLocalStorage } from "utils/storage"

const emptyUser: User = {}

const localForageEffect = (key: string) => ({ setSelf, onSet }) => {
  const savedValue = safeLocalStorage.get(key)
  setSelf(
    savedValue != null ? JSON.parse(savedValue) : new DefaultValue() // Abort initialization if no value was stored
  )

  // Subscribe to state changes and persist them to localForage
  onSet((newValue: any, _: any, isReset: any) => {
    isReset
      ? safeLocalStorage.remove(key)
      : safeLocalStorage.set(key, JSON.stringify(newValue))
  })
}

export const userState = atom({
  key: "user_state",
  default: emptyUser,
  effects: [localForageEffect("current_user")],
})
