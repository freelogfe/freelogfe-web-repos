/**
 * Vuex docs
 * https://vuex.vuejs.org/zh-cn/getting-started.html
 */
import Vuex from 'vuex'
import { Vue } from "@freelog/freelog-common-lib"

import getters from './getters'
import modules from './modules'

const strict = process.env.NODE_ENV !== 'production'

const plugins = []

Vue.use(Vuex)
const store = new Vuex.Store({
  getters, modules, strict, plugins
})

export default store
