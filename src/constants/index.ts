export * from "./chains"
export * from "./keys"

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 20

export const TOKEN_DECIMALS = 18

export const IS_PRODUCTION = process.env.NODE_ENV === "production"

export const ASSET_FEE = 1
