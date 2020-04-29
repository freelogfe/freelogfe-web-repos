import { COOKIE_AUTH_INFO } from './constant'
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

// 从cookie中获取用户授权信息
export function getAuthInfoByCookie() {
	var userInfo = null
	const arr = document.cookie.split(`${COOKIE_AUTH_INFO}=`)

	if(arr.length > 1) {
		const jwtStr  = arr[1].split(';')[0]
		userInfo = parseJWT(jwtStr)
	}
	return userInfo
}

// 解析JWT获取用户信息对象
function parseJWT(jwtStr) {
	var userInfo = null
	try {
		const arr = jwtStr.split('.')
		userInfo = atob(arr[1])
		userInfo = JSON.parse(userInfo)

		Object.keys(userInfo).forEach(key=>{
			if (['userName', 'nickname'].includes(key)) {
				userInfo[key] = decodeURIComponent(userInfo[key])
			}
		})
	}catch(e) {
		console.log(e)
		userInfo = null
	}finally {
		return userInfo
	}
}

export function resolveLink(path, $route) {
  var link = `${path}`
  if ($route != null) {
    const { redirect } = $route.query
    if (isSafeUrl(redirect)) {
      link = `${link}?redirect=${encodeURIComponent(redirect)}`
    }
  }else {
    const hostName = `${window.location.protocol}//www.${window.FreelogApp.Env.mainDomain}`
    link = `${hostName}${link}?redirect=${encodeURIComponent(window.location.href)}`
  }
  return link
}
