import '@freelog/freelog-common-lib/lib/freelog-common.css'
import { Vue, initI18n } from '@freelog/freelog-common-lib'
import {sync} from 'vuex-router-sync'
import VueLazyload from 'vue-lazyload'

import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import i18n from './lib/i18n/index'

import initEnv from '@freelog/freelog-common-lib/src/initEnv'

sync(store, router, {moduleName: 'route'})

initEnv()
Vue.use(plugins)
Vue.use(VueLazyload, {
  lazyComponent: true,
  observer: true
})

Vue.config.devtools = true,
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {App}
})
