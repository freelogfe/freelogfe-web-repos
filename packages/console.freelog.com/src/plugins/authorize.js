import store from '../store'
import router from '../router'
import { gotoLogin } from '../lib/utils'

export default () => {
  router.beforeHooks.unshift((to, from, next) => {
    if (!to.meta.requiresAuth) {
      next()
    } else {
      store.dispatch('checkToken')
        .then((valid) => {
          if (valid) next()
          else gotoLogin(window.location.href)
        })
    }
  })
}
