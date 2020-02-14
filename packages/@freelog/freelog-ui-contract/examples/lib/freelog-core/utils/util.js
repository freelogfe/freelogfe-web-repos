export function getQueryString(params) {
  const esc = encodeURIComponent
  return Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&')
}

export function getDataType(val) {
  return Object.prototype.toString.call(val)
}


export function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

export function isArrayBuffer(val) {
  return getDataType(val) === '[object ArrayBuffer]'
}

export function isArrayBufferView(val) {
  let result
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val)
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer)
  }
  return result
}

export function isFile(val) {
  return getDataType(val) === '[object File]'
}

export function isBlob(val) {
  return getDataType(val) === '[object Blob]'
}

export function isStream(val) {
  return isObject(val) && isFunction(val.pipe)
}

export function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function isFunction(val) {
  return getDataType(val) === '[object Function]'
}
