import { goToLoginPage } from './login'
export default function addAxiosInterceptorHandler(options) {
	const { Vue, axiosInstance, checkIsAuthException } = options
	const axios = axiosInstance || Vue.axios
	axios.interceptors.response.use(
		(response) => {
			if(typeof checkIsAuthException === 'function') {
				if (checkIsAuthException(response)) {
					setTimeout(() => {
						// 跳登录
						goToLoginPage()
					})
	
					// 延迟返回响应
					return new Promise(resolve => {
						setTimeout(() => {
							resolve(response)
						}, 3e2)
					})
				}
			} 
			return response
		},
		(err) => Promise.reject(err),
	)
}
