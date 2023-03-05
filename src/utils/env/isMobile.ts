const navigator = typeof window !== "undefined" ? window.navigator : undefined

export function isIOS() {
  return navigator.userAgent.match(/ipad|iphone/i) != null
}

export function isAndroid() {
  return navigator?.userAgent.match(/Android/i) ?? false
}

export function isMobile() {
  return isIOS() || isAndroid()
}
