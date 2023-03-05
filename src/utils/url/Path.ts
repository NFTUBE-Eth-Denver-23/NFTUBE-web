import Router from "next/router"

import { isClient } from "utils/env/isClient"

export namespace Path {
  export function get(name: string): string | undefined {
    const data = Path.getAll()
    return data[name] ? String(data[name]) : undefined
  }

  export function getAll() {
    return isClient() && Router.router ? Router.query : {}
  }
}
