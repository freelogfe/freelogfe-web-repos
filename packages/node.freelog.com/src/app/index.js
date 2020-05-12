import Vue from 'vue'
import App from './views/app.vue'
import i18n from '@/i18n/index'

import axiosPlugin, { axios } from '@freelog/freelog-common-lib/src/plugins/axios'
import elementUIPlugin from './elementUI-plugins'
import initLogin from '@freelog/freelog-ui-login'
import fReport from '@freelog/freelog-report'
import { FREELOG_APP_MOUNTED } from '../_core/events/pb-event-names'

window.f_common_lib = {
  Vue, axios
}
window.Vue = Vue
window.axios = axios

Vue.use(elementUIPlugin)
Vue.use(axiosPlugin)
initLogin({ Vue, i18n, isRegisterRouter: false })
new Vue({
  el: '#app-auth',
  i18n,
  methods: {},
  render: h => h(App),
  mounted() {
    if (window.FreelogApp) {
      window.FreelogApp.trigger(FREELOG_APP_MOUNTED)
    }
  },
})

fReport.performanceReport({
  reportUrl: 'http://report.testfreelog.com/v1/report/performance'
})
