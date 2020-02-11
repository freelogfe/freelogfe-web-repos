import {sync} from 'vuex-router-sync'
import VueLazyload from 'vue-lazyload'

import { Vue, initEnv } from '@freelog/freelog-common-lib'
import initLogin from '@freelog/freelog-ui-login'
import contractUIPlugin from '@freelog/freelog-ui-contract'
import App from './App.vue'
import router, { registerNotFoundRouete } from './router'
import store from './store'
import plugins from './plugins'
import { i18nStance } from './lib/index'

initEnv()
/* eslint-disable no-new */
initLogin({ Vue, router, i18n: i18nStance })
sync(store, router, {moduleName: 'route'})
// 404页面路由是通配符的路由，须放在最后
registerNotFoundRouete()

Vue.use(contractUIPlugin)
Vue.use(plugins)
Vue.use(VueLazyload, {
  lazyComponent: true,
  observer: true
})
Vue.config.devtools = true
// Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n: i18nStance,
  render: h => h(App),
})
