import { COOKIE_AUTH_INFO } from '../constant'
// 从cookie中获取用户授权信息
export default function getAuthInfoByCookie() {
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