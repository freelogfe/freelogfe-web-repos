import { EXCEPTION_PB_AUTH } from './names.js'

export function throwException(message, name) {
  switch (name) {
    case EXCEPTION_PB_AUTH: {
      break
    }
    default: {}
  }
}
