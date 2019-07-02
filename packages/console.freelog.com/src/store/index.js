/**
 * Vuex docs
 * https://vuex.vuejs.org/zh-cn/getting-started.html
 */
import { Vue } from '@freelog/freelog-common-lib'
import Vuex from 'vuex'

import getters from './getters'
import modules from './modules'
// import global from './global'

Vue.use(Vuex)

const strict = process.env.NODE_ENV !== 'production'
//
// Object.assign(modules, {
//   global
// })
const plugins = []

const store = new Vuex.Store({
  getters, modules, strict, plugins
})

export default store
