export function getUserInfo() {
  var userInfo = null
 var authInfo = getCookie('authInfo')
  if(authInfo) {
    const jwt = authInfo.split('.')
    let tempUserInfo = atob(jwt[1])
    try {
      userInfo = JSON.parse(tempUserInfo)
    } catch (err) {
      console.error(err)
    }
  }

  return userInfo
}

export function getCookie(name){
  var RegE = new RegExp(name + '=')
  var arr = document.cookie.split(';').filter(item => {
    return RegE.test(item)
  })
  if(arr.length) {
    let auInfo = arr[0].replace(RegE, '')
    return auInfo
  }else {
    return null
  }
}