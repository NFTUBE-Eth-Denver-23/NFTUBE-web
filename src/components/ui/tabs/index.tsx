import { ComponentProps, ComponentType, useMemo } from "react"
import { Tab } from "./Tab"
import { TabContext } from "./TabContext"
import { TabIndicator } from "./TabIndicator"

export interface TabsProps<T extends string>
  extends Omit<ComponentProps<"div">, "onChange"> {
  value: T
  onChange: (tabId: T) => void
  indicator?: boolean | ComponentType<{ active?: boolean }>
}

export function Tabs<T extends string>({
  value,
  onChange,
  indicator,
  ...rest
}: TabsProps<T>) {
  const contextValue = useMemo(
    () => ({ activeTabId: value, onChange, indicator }),
    [value, onChange, indicator]
  )

  return (
    <TabContext.Provider value={contextValue}>
      <div {...rest} />
    </TabContext.Provider>
  )
}

Tabs.Tab = Tab
Tabs.Indicator = TabIndicator
