import { useRecoilState } from "recoil"
import { userState } from "store/user/userState"

export function useUser() {
  const [user, setUser] = useRecoilState(userState)

  return { user, setUser }
}
