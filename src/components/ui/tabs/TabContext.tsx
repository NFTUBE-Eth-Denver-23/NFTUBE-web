import { ComponentType, createContext } from "react"

interface TabContextState {
  activeTabId?: string
  onChange?: (tab: string) => void
  indicator?: boolean | ComponentType<{ active?: boolean }>
}

export const TabContext = createContext<TabContextState>({})
