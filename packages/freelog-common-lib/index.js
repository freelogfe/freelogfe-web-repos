/* --------------------------------
 * ------ freelog-common-lib ------
 */

import './index.less'
import Vue from 'vue'
import I18n from 'vue-i18n'
import axios from 'axios'
import ElementUI from 'element-ui'

import elementUiPlugin from './src/plugins/element-ui'
import axiosPlugin from './src/plugins/axios'
import axiosInstance from './src/axios-instance'
import storage, { cookieStore, sessionStore } from './src/storage'
import initI18n from './src/i18n'

Vue.use(I18n)
Vue.use(elementUiPlugin)
Vue.use(axiosPlugin)

export default {
  Vue, axios, ElementUI,
  axiosInstance, storage, cookieStore, sessionStore,
  initI18n,
}
