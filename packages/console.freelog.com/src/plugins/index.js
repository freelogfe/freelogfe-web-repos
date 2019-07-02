/**
 * vue plugins
 */

import title from './title'
import services from './services'
import nprogress from './nprogress'
import authorize from './authorize'
import filters from './filters'
import error from './error'

export default {
  install(Vue) {
    title(Vue, { property: 'title', separator: ' » ' })
    services(Vue)
    nprogress(Vue)
    authorize(Vue)
    filters(Vue)
    error(Vue)
  }
}
