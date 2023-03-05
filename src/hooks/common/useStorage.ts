import { useCallback, useEffect, useMemo, useState } from "react"

import { isClient } from "utils/env/isClient"

export function useLocalStorage<T extends string>(
  key: string,
  defaultValue?: T
) {
  return useStorage(obsLocalStorage, key, defaultValue)
}

export function useSessionStorage<T extends string>(
  key: string,
  defaultValue?: T
) {
  return useStorage(obsSessionStorage, key, defaultValue)
}

export function useStorage<T extends string>(
  storage: ObservableStorage,
  key: string,
  defaultValue?: T
) {
  const initial = useInitialValue(storage, key, defaultValue)
  const [state, setState] = useState(initial)

  useEffect(() => {
    setState(storage.get(key))
    const subscription = storage.subscribe(() => {
      setState(storage.get(key))
    })
    return () => subscription.unsubscribe()
  }, [storage, key])

  const update = useCallback(
    (data?: string) => {
      if (data) {
        storage.set(key, data)
      } else {
        storage.remove(key)
      }
    },
    [storage, key]
  )

  return [state as T, update] as const
}

function useInitialValue<T extends string>(
  storage: ObservableStorage,
  key: string,
  defaultValue?: T
) {
  return useMemo(() => {
    const value = storage.get(key)
    if (value || defaultValue == null) {
      return value
    }
    storage.set(key, defaultValue)
    return defaultValue
  }, [storage, key, defaultValue])
}

function createObservableStorage(storage: Storage) {
  const listeners: Function[] = []
  const subscribe = (listener: () => void) => {
    listeners.push(listener)
    return {
      unsubscribe: () => {
        listeners.splice(listeners.indexOf(listener), 1)
      },
    }
  }

  return {
    get: (key: string) => storage.getItem(key),
    set: (key: string, val: string) => {
      storage.setItem(key, val)
      listeners.forEach((listener) => listener())
    },
    remove: (key: string) => {
      storage.removeItem(key)
      listeners.forEach((listener) => listener())
    },
    subscribe,
  }
}

export type ObservableStorage = ReturnType<typeof createObservableStorage>

export interface Storage {
  getItem(key: string): string | null

  setItem(key: string, value: string): void

  removeItem(key: string): void
}

class MemoryStorage implements Storage {
  private storage = new Map<string, string>()

  public getItem(key: string) {
    return this.storage.get(key) ?? null
  }

  public setItem(key: string, value: string) {
    this.storage.set(key, value)
  }

  public removeItem(key: string) {
    this.storage.delete(key)
  }
}

export const obsSessionStorage = createObservableStorage(
  isClient() ? window.sessionStorage : new MemoryStorage()
)

export const obsLocalStorage = createObservableStorage(
  isClient() ? window.localStorage : new MemoryStorage()
)
