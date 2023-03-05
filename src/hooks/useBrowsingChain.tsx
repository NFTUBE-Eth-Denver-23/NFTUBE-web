import { useRecoilState } from "recoil"
import { browsingChainState } from "store/user/browsingChainState"

export function useBrowsingChain() {
  const [browsingChainId, setBrowsingChainId] =
    useRecoilState(browsingChainState)

  return { browsingChainId, setBrowsingChainId }
}
