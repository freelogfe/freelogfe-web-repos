import Vue from 'vue'
import App from './views/app.vue'
import i18n from '@/i18n/index'

import axiosPlugin from '@freelog/freelog-common-lib/src/plugins/axios'
import elementUIPlugin from './elementUI-plugins'
import initLogin from '@freelog/freelog-ui-login'

Vue.use(elementUIPlugin)
Vue.use(axiosPlugin)

Vue.config.devtools = true
initLogin({ Vue, i18n, isRegisterRouter: false })
new Vue({
  el: '#app-auth',
  i18n,
  methods: {},
  render: h => h(App)
})

window.f_common_lib = {
  Vue
}

window.Vue = Vue
