import createAxiosInstance from "../axios-instance"

const axiosPlugin = {
  install(Vue, axios) {
    const instance = createAxiosInstance(axios)
    
    Object.defineProperties(Vue, {
      axios: { get: () => instance }
    })

    Object.defineProperties(Vue.prototype, {
      $axios: { get: () => instance }
    })
  }
}
export default axiosPlugin
