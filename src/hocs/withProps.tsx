import React, {
  ComponentProps,
  ComponentType,
  createElement,
  CSSProperties,
  ForwardedRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactHTML,
  RefAttributes,
} from "react"

import clsx from "clsx"

export type RestProps<P, K extends keyof P> = Omit<P, K> & Partial<P>
export type ResultComponent<
  P,
  K extends keyof P,
  T
> = ForwardRefExoticComponent<
  PropsWithoutRef<RestProps<P, K>> & RefAttributes<T>
>

export function withProps<
  Type extends keyof ReactHTML,
  BasePropKeys extends keyof ComponentProps<Type>,
  RefTarget
>(
  type: Type,
  baseProps: Pick<ComponentProps<Type>, BasePropKeys>
): ResultComponent<ComponentProps<Type>, BasePropKeys, RefTarget>

export function withProps<Props, BasePropKeys extends keyof Props, RefTarget>(
  Component: ComponentType<Props>,
  baseProps: Pick<Props, BasePropKeys>
): ResultComponent<Props, BasePropKeys, RefTarget>

export function withProps<Props, BasePropKeys extends keyof Props, RefTarget>(
  target: keyof ReactHTML | ComponentType<Props>,
  baseProps: Pick<Props, BasePropKeys>
) {
  if (checkIsTagType(target)) {
    return React.forwardRef(
      (props: RestProps<Props, BasePropKeys>, ref: ForwardedRef<RefTarget>) =>
        createElement(target, { ...mergeProps(baseProps, props), ref })
    )
  }
  const Component = target
  return React.forwardRef(
    (props: RestProps<Props, BasePropKeys>, ref: ForwardedRef<RefTarget>) => (
      <Component
        {...mergeProps<Props, BasePropKeys>(baseProps, props)}
        ref={ref}
      />
    )
  )
}

export function checkIsTagType(target: unknown): target is keyof ReactHTML {
  return typeof target === "string"
}

function mergeProps<Props, BasePropKeys extends keyof Props>(
  baseProps: Pick<Props, BasePropKeys>,
  props: RestProps<Props, BasePropKeys>
): Props {
  const merged = {
    ...baseProps,
    ...props,
  } as Props

  if (hasClassName(merged)) {
    merged.className = mergeClassName(baseProps, props)
  }

  if (hasStyle(merged)) {
    merged.style = mergeStyle(baseProps, props)
  }

  return merged
}

function mergeClassName<P, P2>(props1: P, props2: P2) {
  const className1 = hasClassName(props1) ? props1.className : undefined
  const className2 = hasClassName(props2) ? props2.className : undefined
  return clsx(className1, className2)
}

function hasClassName(
  props: unknown
): props is { className: string; [index: string]: unknown } {
  return typeof props === "object" && "className" in props
}

function mergeStyle<P, P2>(props1: P, props2: P2) {
  if (!hasStyle(props1) && !hasStyle(props2)) {
    return
  }
  const style1 = hasStyle(props1) ? props1.style : {}
  const style2 = hasStyle(props2) ? props2.style : {}
  return { ...style1, ...style2 }
}

function hasStyle(
  props: unknown
): props is { style: CSSProperties; [index: string]: unknown } {
  return typeof props === "object" && "style" in props
}
