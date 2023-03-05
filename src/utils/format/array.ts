export const insert = (arr: Array<any>, newItem: any, index: number) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index + 1),
]

export const remove = (arr: Array<any>, index: number) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
]
