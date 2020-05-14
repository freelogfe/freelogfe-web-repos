

import FLogin from './src/components/login/index.vue'
import FSignup from './src/components/signup/index.vue'
import FRsetPassword from './src/components/reset-password/index.vue'
import initLogin from './src/init'
import { checkLoginStatus, logout } from './src/core'
import getUserInfo from './src/shared/getUserInfo'
import { goToLoginPage } from './src/login'
import { USER_SESSION, COOKIE_AUTH_INFO, LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH, USER_CENTER_PATH } from './src/constant'

export {
	FLogin, FSignup, FRsetPassword,
	goToLoginPage, logout, getUserInfo, checkLoginStatus,
	USER_SESSION, COOKIE_AUTH_INFO, LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH, USER_CENTER_PATH
}
export default initLogin