import { LAST_AUTH_INFO, USER_SESSION, LOGIN_PATH, HOME_PATH } from './constant'
import { setItemForStorage, getAuthInfoByCookie } from './utils'

function goToPath(path) {
	return new Promise(resolve => {
		window.location.replace(path)
		// if(router !== null) {
		// 	router.replace({ path })
		// }else {
		// 	window.location.replace(path)
		// }
		resolve()
	})
}

// 跳登录页
export function goToLoginPage() {
	if (window.location.pathname !== LOGIN_PATH) {
		const redirect = encodeURIComponent(window.location.href)
		var targetPath = `${LOGIN_PATH}?redirect=${redirect}`
		return goToPath(targetPath)
	}
}

// 跳首页
export function goToHomePage() {
	return goToPath(HOME_PATH)
}
