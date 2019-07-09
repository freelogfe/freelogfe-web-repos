import { LAST_CHECKED_USER_INFO, COOKIE_AUTH_INFO, USER_SESSION, LOGIN_PATH, RESET_PASSWORD_PATH, SIGN_PATH, HOME_PATH } from './constant'
import { getItemFromStorage, setItemForStorage } from './utils'

import Toast from './components/toast/toast'

var axiosInstance = null
var router = null
export default function initCode(options) {
	axiosInstance = options.axiosInstance || options.Vue.axios
	router = options.router
}

function goToPath(path) {
	return new Promise(resolve => {
		if(router !== null) {
			router.replace({ path })
		}else {
			window.location.replace(path)
		}
		resolve()
	})
}

// 跳登录页
export function goToLoginPage() {
	const redirect = encodeURIComponent(window.location.href)
	var targetPath = `${LOGIN_PATH}?redirect=${redirect}`
	return goToPath(targetPath)
}

// 跳首页
export function goToHomePage() {
	return goToPath(HOME_PATH)
}

// 登出：用户退出登录
export function logout() {
	return axiosInstance.get('/v1/passport/logout')
		.then(res => res.data)
		.then(res => {
			if(res.errcode === 0) {
				localStorage.removeItem(USER_SESSION)
				goToLoginPage()
				return Promise.resolve()
			}else {
				return Promise.reject()
			}
		})
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

/**
 * 获取用户信息
 * @return Promise
 */
export function getUserInfo() {
	const authInfo = getAuthInfoByCookie()
	if(authInfo === null || !authInfo.userId) {
		return Promise.resolve(null)
	}

	try {
		var userSession = getItemFromStorage(USER_SESSION)
		if(typeof userSession !== 'object') {
			throw userSession
		}
	}catch(e) {
		console.log('getUserInfo:', e)
		userSession = null
	}

	if(userSession !== null) {
		return Promise.resolve(userSession)
	}else {
		let promise
		if (authInfo.userId) {
			promise = axiosInstance.get(`/v1/userinfos/${authInfo.userId}`)
		} else {
			promise = axiosInstance.get('/v1/userinfos/current')
		}
		return promise.then(res => res.data).then((res) => {
			if (res.errcode === 0) {
				setItemForStorage(USER_SESSION, res.data)
				return res.data
			}else {
				return null
			}
		})
	}
}

// 获取当前用户登录状态
export function checkLoginStatus() {
	const checkPromise = getUserInfo()
		.then(userInfo => {
			if(userInfo === null) return 0			// 未登录
			
			const lastCheckedUserInfo = getItemFromStorage(LAST_CHECKED_USER_INFO)
			setItemForStorage(LAST_CHECKED_USER_INFO, userInfo)
		
			// 如果两者用户ID不同，则说明已经切换用户
			if(userInfo.userId !== lastCheckedUserInfo.userId) {
				return 2		// 已登录：新用户
			}else {
				return 1		// 已登录：原本用户
			}
		})
	return checkPromise
}

// 身份认证并执行对应操作
export function runAuthenticationHandler() {
	return checkLoginStatus()
			.then(loginStatus => {
				console.log('loginStatus --', loginStatus)
				switch(loginStatus) {
					case 0: {
						//  去登录
						if([LOGIN_PATH, RESET_PASSWORD_PATH, SIGN_PATH].indexOf(window.location.pathname) === -1) {
							goToLoginPage()
						}
						break
					}
					// 当值为2时，则表示当前窗口已切换了新用户
					case 2: {
						// 跳首页
						Toast({
							msg: '已切换用户，即将跳转至首页！',
							afterCountDown() {
								goToHomePage()
							}
						})
						break
					}
					default: {
					}
				}
			})
	
}