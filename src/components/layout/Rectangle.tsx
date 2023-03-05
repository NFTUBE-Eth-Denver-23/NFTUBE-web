import styled from "@emotion/styled"

export const Rectangle = styled.div<{ proportion?: number }>`
  position: relative;
  width: 100%;

  &::after {
    content: "";
    display: block;
    padding-bottom: ${(p) => (p.proportion ?? 1) * 100}%;
  }

  & > * {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`
