const options = {
    Vue: null,
	// axios 实例
	axiosInstance: null,
	// 是否添加响应拦截器
	isAddResponseInterceptor: true,
	// vueRouter实例
	router: null,
	// 是否注册路由
	isRegisterRouter: true,
	// 进入路由之前是否验证身份授权
	isAuthenticationBeforeRoute: true,
	// 是否监听当前窗口的显隐状态变化，是则当状态变化时重新验证用户信息
	isListenWindowVisibility: true,
	checkIsAuthException(response) {
		const { data } = response
		return [28, 30].indexOf(data.errcode) > -1
	}
}

export default options

export function checkOptions(options) {
	const { Vue, axiosInstance, isRegisterRouter, router, isAuthenticationBeforeRoute } = options
	const errMsg = []

	if (!Vue) {
		errMsg.push('缺少必要参数：Vue！')
	}

	const axios = axiosInstance || Vue.axios
	if (!axios) {
		errMsg.push('缺少必要参数：axiosInstance！')
	}

	if (isRegisterRouter && router === null) {
		errMsg.push('缺少必要参数：router；当时isRegisterRouter为true，router为必要参数！')
	}

	if (isAuthenticationBeforeRoute && router === null) {
		errMsg.push('缺少必要参数：router；当时isAuthenticationBeforeRoute为true，router为必要参数！')
	}

	if (errMsg.length > 0) {
		throw new Error(errMsg.join('\n'))
	}
}