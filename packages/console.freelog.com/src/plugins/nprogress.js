/**
 * Inject NProgress into Vue component
 * Show progressbar when route & ajax
 */

import router from '../router'
import { axios, nprogress } from '../lib'

export default (Vue) => {
  router.beforeEach((to, from, next) => {
    nprogress.start()
    next()
  })

  router.afterEach(() => {
    nprogress.done()
  })

  axios.interceptors.request.use((config) => {
    nprogress.start()
    return config
  })

  axios.interceptors.response.use((response) => {
    nprogress.done()
    return response
  }, (err) => {
    nprogress.done()
    return Promise.reject(err)
  })


  Object.defineProperties(Vue.prototype, {
    $nprogress: { get: () => nprogress }
  })
}
