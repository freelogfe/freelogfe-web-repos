

import '../style/loading.less'
import '@freelog/freelog-common-lib/lib/freelog-common.css'

import App from './app.vue'
import cn from '../../lib/i18n/locales/cn'
import en from '../../lib/i18n/locales/en'
import { Vue, initI18n } from '@freelog/freelog-common-lib'
import contractUIPlugin from '@freelog/freelog-ui-contract'

Vue.use(contractUIPlugin)

new Vue({
  el: '#app-auth',
  i18n: initI18n({ cn, en }),
  methods: {},
  render: h => h(App)
})





