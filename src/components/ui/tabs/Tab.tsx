import { ComponentProps, ReactNode } from "react"

import styled from "@emotion/styled"

import { TabContext } from "./TabContext"
import { TabIndicator } from "./TabIndicator"

interface Props extends Omit<ComponentProps<"div">, "children"> {
  id: string
  htmlId?: ComponentProps<"div">["id"]
  children: (active: boolean) => ReactNode
  disabled?: boolean
}

export function Tab({ id, children, disabled, ...rest }: Props) {
  return (
    <TabContext.Consumer>
      {({ activeTabId, onChange, indicator: Indicator }) => {
        return (
        <StyledTabContainer
          draggable="false"
          {...rest}
          id={rest.htmlId}
          onClick={() => !disabled && onChange(id)}
          disabled={disabled}
        >
          {children(activeTabId === id)}
          {typeof Indicator === "boolean" ? (
            Indicator && <TabIndicator active={activeTabId === id} />
          ) : (
            <Indicator active={activeTabId === id} />
          )}
        </StyledTabContainer>
      )}
    }
    </TabContext.Consumer>
  )
}

const StyledTabContainer = styled.div<{ disabled?: boolean }>`
  ${(p) =>
    p.disabled ? `opacity: 0.4; cursor: not-allowed;` : "cursor: pointer;"};
`
