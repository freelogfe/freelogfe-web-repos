import store from '../store'

export default (Vue) => {
  Object.defineProperties(Vue, {
    vuex: { get: () => store }
  })

  Object.defineProperties(Vue.prototype, {
    $vuex: { get: () => store }
  })
}

