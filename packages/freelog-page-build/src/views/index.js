

import '../style/loading.less'
import '@freelog/freelog-common-lib/lib/freelog-common.css'

import { Vue } from '@freelog/freelog-common-lib'
import contractUIPlugin from '@freelog/freelog-ui-contract'
import App from './app.vue'
import i18n from '@/lib/i18n/index'

Vue.use(contractUIPlugin)

Vue.config.devtools = true
new Vue({
  el: '#app-auth',
  i18n,
  methods: {},
  render: h => h(App)
})





