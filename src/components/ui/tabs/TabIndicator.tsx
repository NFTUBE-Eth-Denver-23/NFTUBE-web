import styled from "@emotion/styled"

export const TabIndicator = styled.div<{ active: boolean }>`
  width: 100%;
  height: 2px;
  transition: all 300ms;
  ${(p) => (p.active ? `background: #000000;` : ``)}
`
