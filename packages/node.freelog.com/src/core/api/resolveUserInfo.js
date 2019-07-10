import { cookieStore } from '@freelog/freelog-common-lib/src/storage'

export function getUserInfo() {
  const authInfo = cookieStore.get('authInfo')
  if(!authInfo) {
    return null
  }else {
    const jwt = authInfo.split('.')
    let userInfo
    try {
      userInfo = atob(jwt[1])
      userInfo = JSON.parse(userInfo)
    } catch (err) {
      console.error(err)
      userInfo = {}
    }
    return userInfo
  }
}

export function checkUserIsLogin() {
  return getUserInfo() !== null
}
