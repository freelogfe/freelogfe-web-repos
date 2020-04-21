import { Vue, axios } from '@freelog/freelog-common-lib'
import contractUIPlugin from '@freelog/freelog-ui-contract'
import initLogin from '@freelog/freelog-ui-login'
import fReport from '@freelog/freelog-report'

import App from './app.vue'
import i18n from '@/i18n/index'

Vue.use(contractUIPlugin)
initLogin({ Vue, isRegisterRouter: false, i18n })

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

performance.mark('f-setTimeout-start')
setTimeout(() => {
  performance.mark('f-setTimeout-end')
  performance.measure('f-setTimeout', 'f-setTimeout-start', 'f-setTimeout-end')
  const measures = performance.getEntriesByName('f-setTimeout')
  console.log("setTimeout milliseconds:", measures[0], measures[0].duration)

  // 清除存储的标志位
  performance.clearMarks()
  performance.clearMeasures()
}, 3e3)



fReport.performanceReport({
  reportUrl: 'http://127.0.0.1:7002/v1/nodeReport/test'
})

