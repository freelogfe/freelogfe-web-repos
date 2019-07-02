import { axiosInstance } from '@freelog/freelog-common-lib'
import { gotoLogin } from './utils'

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response
    const loginPath = '/login'

    if ([28, 30].indexOf(data.errcode) > -1 && window.location.pathname !== loginPath) {
      gotoLogin(true, true);
      return null
    }
    return response
  },
  (err) => {
    err.response = err.response || {}
    return Promise.reject(err)
  },
)
export default axiosInstance
