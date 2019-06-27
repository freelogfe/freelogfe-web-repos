/**
 * vue plugins
 */

import axios from './axios'
import filters from './filters'
import eventBus from './event-bus'
// import store from './store'
import error from './error'

export default {
  install(Vue) {
    error(Vue)
    filters(Vue)
    axios(Vue)
    // store(Vue)
    eventBus(Vue)
  }
}
