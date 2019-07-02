import '@freelog/freelog-common-lib/lib/freelog-common.css'

import Router from 'vue-router'
import { Vue } from '@freelog/freelog-common-lib'

import initEnv from '@freelog/freelog-common-lib/src/initEnv'
import contractUIPlugin from '@freelog/freelog-ui-contract/src/index'

import App from './app.vue'
import routerConfig from '@/router/index'
import store from '@/store/index'
import plugins from '@/plugins/index'
import i18n from '@/lib/i18n/index'
import '@/lib/axios'

initEnv()
Vue.use(Router)
Vue.use(contractUIPlugin)
Vue.use(plugins)

Vue.config.devtools = true
new Vue({
  el: '#app',
  store,
  router: new Router(routerConfig),
  i18n,
  methods: {},
  render: h => h(App)
})
















