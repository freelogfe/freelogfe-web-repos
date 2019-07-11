/**
 * vue plugins
 */

import title from './title'
import services from './services'
import nprogress from './nprogress'
import filters from './filters'
import error from './error'

export default {
  install(Vue) {
    title(Vue, { property: 'title', separator: ' » ' })
    services(Vue)
    nprogress(Vue)
    filters(Vue)
    error(Vue)
  }
}
