/**
 * vue plugins
 */

import filters from './filters'
import error from './error'

export default {
  install(Vue) {
    error(Vue)
    filters(Vue)
  }
}
