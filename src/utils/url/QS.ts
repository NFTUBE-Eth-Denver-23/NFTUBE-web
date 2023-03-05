export namespace QS {
  export function get(name: string): string | undefined {
    return getData()[name]
  }

  export function getData(
    queryString: string = typeof location !== "undefined" ? location.search : ""
  ) {
    const query = queryString.trim().replace(/^[?#&]/, "")
    const searchParams = new URLSearchParams(query)
    const result: Record<string, string> = {}
    searchParams.forEach((value, key) => (result[key] = value))
    return result
  }

  export function create(
    params: Record<string, string | number | boolean | undefined>
  ) {
    const queryString = Object.keys(params)
      .filter((key) => params[key] !== undefined)
      .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
      .join("&")

    if (!queryString) {
      return ""
    }

    return `?${queryString}`
  }
}
