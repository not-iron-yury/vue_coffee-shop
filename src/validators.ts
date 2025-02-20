export const isValidPrice = (value: unknown): boolean => typeof value === 'number' && value >= 0

export const isValidLabel = (value: unknown): boolean => {
  if (!isString(value)) {
    return false
  }
  const stringValue = value as string
  return stringValue.length > 0
}

const isString = (value: unknown): boolean => typeof value === 'string'
