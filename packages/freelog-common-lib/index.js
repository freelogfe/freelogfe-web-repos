/* --------------------------------
 * ------ freelog-common-lib ------
 */

import './index.less'
import Vue from 'vue'
import I18n from 'vue-i18n'

import elementUiPlugin from './src/plugins/element-ui'
import axiosPlugin from './src/plugins/axios'
import axios from './src/axios-instance'
import storage, { cookieStore } from './src/storage'
import initI18n from './src/i18n'

Vue.use(I18n)
Vue.use(elementUiPlugin)
Vue.use(axiosPlugin)

export default {
  Vue, axios, storage, cookieStore,
  initI18n,
}
