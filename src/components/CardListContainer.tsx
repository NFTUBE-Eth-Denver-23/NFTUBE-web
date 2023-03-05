import { ComponentProps, Children } from "react"

import styled from "@emotion/styled"
import { range } from "lodash"

import { Media } from "utils/css"
import { CollectionCardSkeleton } from "./card/CollectionCardSkeleton"
import { NFTCardSkeleton } from "./card/NFTCardSkeleton"

export enum CardListAlignTypes {
  center = "center",
  left = "left",
}

interface Props extends ComponentProps<"div"> {
  loading?: boolean
  align?: CardListAlignTypes
  collection?: boolean
}

export function CardListContainer({
  loading,
  children,
  collection,
  align,
  ...props
}: Props) {
  const ContainerComponent = collection
    ? CollectionListContainer
    : ListContainer

  const count = Children.count(children)
  return (
    <Center>
      <ContainerComponent
        align={align}
        loading={loading ? 1 : 0}
        count={count}
        {...props}
      >
        {loading
          ? range(0, 8).map((i: number) => {
              return collection ? (
                <CollectionCardSkeleton key={i} />
              ) : (
                <NFTCardSkeleton key={i} />
              )
            })
          : children}
      </ContainerComponent>
    </Center>
  )
}

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
`

const BaseContainer = styled.div`
  display: grid;
  grid-row-gap: 24px;
  justify-content: center;
`

const ListContainer = styled(BaseContainer)<{
  align: string
  count: number
  loading: number
}>`
  ${(p) =>
    Media.screen("sm")(`
    grid-template-columns: repeat(${
      p.loading || p.align == CardListAlignTypes.left ? 3 : Math.min(p.count, 3)
    }, 1fr);
    grid-gap: 12px;
  `)}
  ${(p) =>
    Media.screen("lg")(`
    display: grid;
    grid-template-columns: repeat(${
      p.loading || p.align == CardListAlignTypes.left ? 4 : Math.min(p.count, 4)
    }, 1fr);
    grid-gap: 16px;
  `)}
  ${(p) =>
    Media.screen("xl")(`
    grid-template-columns: repeat(${
      p.loading || p.align == CardListAlignTypes.left ? 5 : Math.min(p.count, 5)
    }, 1fr);
    grid-gap: 24px;
  `)}
`
const CollectionListContainer = styled(BaseContainer)<{
  align: string
  count: number
  loading: number
}>`
  ${(p) =>
    Media.screen("sm")(`
    grid-template-columns: repeat(${
      p.loading || p.align == CardListAlignTypes.left ? 1 : Math.min(p.count, 1)
    }, 1fr);
    grid-gap: 12px;
  `)}
  ${(p) =>
    Media.screen("md")(`
    grid-template-columns: repeat(${
      p.loading || p.align == CardListAlignTypes.left ? 2 : Math.min(p.count, 2)
    }, 1fr);
    grid-gap: 16px;
  `)}
  ${(p) =>
    Media.screen("xl")(`
    grid-template-columns: repeat(${
      p.loading || p.align == CardListAlignTypes.left ? 3 : Math.min(p.count, 3)
    }, 1fr);
    grid-gap: 24px;
  `)}
`
