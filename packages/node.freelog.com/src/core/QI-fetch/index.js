

import qiFetch from './fetch-core'
import defaults from './defaults'
import { deepMerge } from '../utils/util'

function createQIFetch(opts = {}) {
  const defaultOpts = deepMerge(defaults, opts)
  return function (url, options = {}) {
    if(typeof url === 'object') {
      options = Object.assign(options, url)
    }else {
      options.url = url
    }
    return qiFetch(deepMerge(defaultOpts, options))
  }
}

export default createQIFetch

