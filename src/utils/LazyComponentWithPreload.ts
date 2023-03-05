import dynamic, { DynamicOptions } from "next/dynamic"
import { ComponentType } from "react"

export type LazyComponentWithPreloadFactoryType<P = any> = ComponentType<P> & {
  preload?: Function
}

export const LazyComponentWithPreloadFactory = (
  loader: () => Promise<any>,
  options: DynamicOptions = { loading: ({}) => null }
) => {
  const Component: LazyComponentWithPreloadFactoryType = dynamic(loader, {
    ...options,
  })
  Component.preload = loader
  return Component
}
