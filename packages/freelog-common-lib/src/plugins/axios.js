import instance from "../axios-instance"

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
export default axiosPlugin
