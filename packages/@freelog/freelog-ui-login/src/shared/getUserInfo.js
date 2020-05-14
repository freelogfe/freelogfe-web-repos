import { USER_SESSION } from '../constant'
import getAuthInfoByCookie from './getAuthInfoByCookie'
import { getItemFromStorage, setItemForStorage } from '../utils'

// 获取用户信息
export default function getUserInfo() {
	const authInfo = getAuthInfoByCookie()
	if(authInfo === null || !authInfo.userId) {
		// 删除用户信息的缓存：防止用户授权过时，仍能拿到用户信息
		window.localStorage.removeItem(USER_SESSION)
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

	if(userSession !== null && authInfo.userId === userSession.userId) {
		return Promise.resolve(userSession)
	}else {
		return window.fetch(`/v1/userinfos/${authInfo.userId}`, { credentials: 'include' })
			.then(resp => resp.json())
			.then((res) => {
				if (res.errcode === 0) {
					setItemForStorage(USER_SESSION, res.data)
					return res.data
				}else {
					return null
				}
			})
	}
}