import '@freelog/freelog-common-lib/lib/freelog-common.css'

import Router from 'vue-router'

import App from './app.vue'
import routerConfig from '@/router/index'
import store from '@/store/index'
import contractUIPlugin from '@freelog/freelog-ui-contract/src/index'
import plugins from '@/plugins/index'
import '@/lib/index'
import cn from '@/lib/i18n/locales/cn'
import en from '@/lib/i18n/locales/en'

import { Vue, initI18n } from '@freelog/freelog-common-lib'

Vue.use(Router)
Vue.use(contractUIPlugin)
Vue.use(plugins)

new Vue({
  el: '#app',
  store,
  router: new Router(routerConfig),
  i18n: initI18n({ cn, en }),
  methods: {},
  render: h => h(App)
})
















