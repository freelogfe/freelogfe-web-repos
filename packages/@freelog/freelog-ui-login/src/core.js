import { LAST_AUTH_INFO, MESSAGE_TO_NEW_USER, USER_SESSION, LOGIN_PATH, RESET_PASSWORD_PATH, SIGN_PATH, HOME_PATH } from './constant'
import { goToLoginPage, goToHomePage } from './login'
import { getItemFromStorage, setItemForStorage } from './utils'
import getAuthInfoByCookie from './shared/getAuthInfoByCookie'
import getUserInfo from './shared/getUserInfo'

import Toast from './components/toast/toast'

var lastCheckedUserInfo = null
var axiosInstance = null
var router = null
export default function initCode(options) {
	axiosInstance = options.axiosInstance || options.Vue.axios
	router = options.router
	lastCheckedUserInfo = getAuthInfoByCookie()
}

// 登出：用户退出登录
export function logout() {
	const authInfo = getAuthInfoByCookie()
	return axiosInstance.get('/v1/passport/logout')
		.then(res => res.data)
		.then(res => {
			if(res.errcode === 0) {
				localStorage.removeItem(USER_SESSION)
				setItemForStorage(LAST_AUTH_INFO, authInfo)
				goToLoginPage()
				return Promise.resolve()
			}else {
				return Promise.reject()
			}
		})
}

// 获取当前用户登录状态
export function checkLoginStatus() {
	const checkPromise = getUserInfo()
		.then(userInfo => {
			if(userInfo === null) {
				return 0			// 未登录
			} else {
				return 1			// 已登录
			}
		})
	return checkPromise
}

// 身份认证并执行对应操作
export function runAuthenticationHandler() {
	const authInfo = getAuthInfoByCookie()
	return getUserInfo()
			.then(userInfo => {
				if([LOGIN_PATH, RESET_PASSWORD_PATH, SIGN_PATH].indexOf(window.location.pathname) !== -1) return 
				if(userInfo === null) {	
					if(router != null) {
						//  去登录
						goToLoginPage()
					}
					
				} else {		
					console.log('已登录 last -', lastCheckedUserInfo && lastCheckedUserInfo.userId, 'auth -', authInfo.userId, 'userInfo -', userInfo.userId)
					
					// 如果两者用户ID不同，则说明已经切换用户：新用户
					if(lastCheckedUserInfo && userInfo.userId !== lastCheckedUserInfo.userId) {
						lastCheckedUserInfo = userInfo
						// 跳首页
						Toast({
							msg: MESSAGE_TO_NEW_USER,
							afterCountDown() {
								goToHomePage()
							}
						})
					}
				}
			})
	
}