

import FLogin from './src/components/login/index.vue'
import FSignup from './src/components/signup/index.vue'
import FRsetPassword from './src/components/reset-password/index.vue'
import initLogin from './src/init'
import { goToLoginPage, logout, getUserInfo, checkLoginStatus } from './src/core'
import { USER_SESSION, COOKIE_AUTH_INFO } from './src/constant'

export {
	FLogin, FSignup, FRsetPassword,
	goToLoginPage, logout, getUserInfo, checkLoginStatus,
	USER_SESSION, COOKIE_AUTH_INFO
}
export default initLogin