export const isValidPrice = (value: unknown): boolean => {
  if (!isNumber(value)) return false
  const wightValue = value as number
  return wightValue > -1
}

export const isValidWeight = (value: unknown): boolean => {
  if (!isNumber(value)) return false
  const wightValue = value as number
  return wightValue > 499
}

export const isValidLabel = (value: unknown): boolean => {
  if (!isString(value)) return false
  const stringValue = value as string
  return stringValue.length > 0
}

const isString = (value: unknown): boolean => typeof value === 'string'
export const isNumber = (value: unknown): boolean => typeof value === 'number'
