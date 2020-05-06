import Vue from 'vue'

import axiosPlugin from '@freelog/freelog-common-lib/src/plugins/axios'

import App from './views/app.vue'
import i18n from '@/i18n/index'
import elementUIPlugin from './elementUI-plugins'

Vue.use(elementUIPlugin)
Vue.use(axiosPlugin)

Vue.config.devtools = true
new Vue({
  el: '#app-auth',
  i18n,
  methods: {},
  render: h => h(App)
})
window.f_common_lib = {
  Vue
}

