import { axios } from '../lib'

export default (Vue) => {
  Object.defineProperties(Vue, {
    axios: { get: () => axios }
  })

  Object.defineProperties(Vue.prototype, {
    $axios: { get: () => axios }
  })
}

