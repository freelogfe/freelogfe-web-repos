/* --------------------------------
 * ------ freelog-common-lib ------
 */

import Vue from 'vue'
import axios from 'axios'

import elementUiPlugin, { ElementUI } from './src/plugins/element-ui'
import axiosPlugin from './src/plugins/axios'
import createAxiosInstance from './src/axios-instance'
import storage, { cookieStore, sessionStore } from './src/storage'
import initI18n, { I18n } from './src/i18n'
import initEnv from './src/initEnv'

Vue.use(I18n)
Vue.use(elementUiPlugin)
Vue.use(axiosPlugin, axios)
const axiosInstance = createAxiosInstance(axios)
export {
  Vue, 
  storage, cookieStore, sessionStore,
  ElementUI, elementUiPlugin,
  axios, axiosInstance,  axiosPlugin, 
  initI18n, initEnv
}
