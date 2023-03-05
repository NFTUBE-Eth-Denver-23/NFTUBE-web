import React, { useEffect, useRef, useState } from "react"

import { useWeb3React } from "@web3-react/core"

import { injected } from "connectors/connectors"
import { isSupportedChain } from "constants/chains"
import { useUser } from "hooks/useAuth"

export function useEagerConnect() {
  const { user } = useUser()
  const { account, activate, deactivate, active, chainId } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (!user?.userId) return
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!user?.userId) return
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  useEffect(() => {
    if (!user?.userId) return
    if (!isSupportedChain(chainId)) {
      deactivate()
    }
  }, [chainId])

  const ref = useRef(account)
  useEffect(() => {
    ref.current = account
  }, [account])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { user } = useUser()
  const { account, active, error, activate, deactivate, chainId } =
    useWeb3React()

  useEffect((): any => {
    if (!user?.userId) return
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !suppress) {
      const handleConnect = () => {
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("'chainChanged' event with payload", chainId)
        window.location.reload()
        deactivate()
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          deactivate()
        }
      }
      const handleNetworkChanged = (chainId: string | number) => {
        console.log("'networkChanged' event with payload", chainId)
        window.location.reload()
        deactivate()
      }

      ethereum.on("connect", handleConnect)
      ethereum.on("chainChanged", handleChainChanged)
      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("networkChanged", handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect)
          ethereum.removeListener("chainChanged", handleChainChanged)
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("networkChanged", handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate])

  const ref = useRef(account)
  useEffect(() => {
    ref.current = account
  }, [account])
}

export function Web3Manager({ children }: { children: React.ReactNode }) {
  const { connector, active, deactivate, library, chainId } = useWeb3React()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  useEffect(() => {
    if (!library) {
      return
    }

    //auto switch chain if on different chain
    // ;(async () => {
    //   const chainInfo = getChain(DEFAULT_CHAIN_ID)
    //   const provider = library.provider as ExternalProvider
    //   await switchChain(provider, chainInfo.chainId, chainInfo)
    // })()
  }, [library, active])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(triedEager)

  return <>{children}</>
}
