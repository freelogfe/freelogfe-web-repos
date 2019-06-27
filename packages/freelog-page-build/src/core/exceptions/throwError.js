export function createError(message, name) {
  const errInstance = new Error(message)
  if(name) {
    errInstance.name = name
  }
  return errInstance
}

export function throwError(message, name) {
  throw createError(message, name)
}

