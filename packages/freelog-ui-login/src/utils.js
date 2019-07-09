export function isSafeUrl(url) {
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

export function getItemFromStorage(name) {
  const value = window.localStorage.getItem(name)
  try{
    var oJSON = JSON.parse(value)
  }catch(e) {
    oJSON = null
  }
  return oJSON !== null ? oJSON : value
}

export function setItemForStorage(name, value) {
  if(typeof value === 'object') {
    window.localStorage.setItem(name, JSON.stringify(value))
  } else {
    window.localStorage.setItem(name, value)
  }
}