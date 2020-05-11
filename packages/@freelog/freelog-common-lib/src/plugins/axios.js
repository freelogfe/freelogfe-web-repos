import instance, { axios } from "../axios-instance"

const axiosPlugin = {
  install(Vue) {
    Object.defineProperties(Vue, {
      axios: { get: () => instance }
    })

    Object.defineProperties(Vue.prototype, {
      $axios: { get: () => instance }
    })
  }
}
export { axios }
export default axiosPlugin
