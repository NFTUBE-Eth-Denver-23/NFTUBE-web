export function ipfsToHttp(url?: string) {
  return url?.replace("ipfs://", "https://ipfs.io/ipfs/")
}
