import { ComponentProps, ComponentType, CSSProperties, ReactHTML } from "react"

import { createTextStyle, TextStyleProps } from "utils/createTextStyle"

import { checkIsTagType, ResultComponent, withProps } from "./withProps"

export function withTextStyle<Type extends keyof ReactHTML, RefTarget>(
  type: Type,
  props: TextStyleProps
): ResultComponent<ComponentProps<Type>, keyof ComponentProps<Type>, RefTarget>

export function withTextStyle<
  Props extends { style?: CSSProperties; className?: string },
  BasePropKeys extends keyof Props,
  RefTarget
>(
  Component: ComponentType<Props>,
  props: TextStyleProps
): ResultComponent<Props, BasePropKeys, RefTarget>

export function withTextStyle<
  Props extends { style?: CSSProperties; className?: string }
>(target: keyof ReactHTML | ComponentType<Props>, props: TextStyleProps) {
  if (checkIsTagType(target)) {
    return withProps(target, createTextStyle(props))
  }
  return withProps(target, createTextStyle(props))
}
