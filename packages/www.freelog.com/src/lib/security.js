export const isSafeUrl = function (url) {
  const reg = /^.+\.(test)?freelog\.com$/

  try {
    const obj = new URL(url) // 正确的链接检测
    if (reg.test(obj.hostname)) {
      return true
    }
  } catch (e) {
    // path型链接检测
    if ((/^\/[^/]+/.test(url))) {
      return true
    }
  }

  return false
}

export default {
  isSafeUrl
}
