/**
 * 1. fetch语法简洁，语义化；
 * 2. fetch返回Promise对象，异步编程更有友好；
 * 3. fetch相较于XHR，它的请求参数参数更加丰富
 * 4. fetch的浏览器兼容性覆盖率达到91.07%，但不支持IE
 * 5. fetch默认不携带cookie，可手动设置参数credientials:'include'
 *
 */
import { isAbsoluteURL } from '../utils/util'
import { throwError, createError } from "../exceptions/throwError"
import { EXCEPTION_NETWORK, EXCEPTION_TIMEOUT } from '../exceptions/names'
import { combineURLs, complementQueryString } from '../helpers/index'
import { transformRequests, transformResponses } from './transform'

function qiFetch(options = {}) {

  options.method = options.method ? options.method.toLowerCase() : 'get'
  options.headers = options.headers || {}

  if(options.data) {
    if(options.method === 'get'){
      options.url = complementQueryString(options.url, options.data)
    }else {
      options.body = options.data
    }
    Reflect.deleteProperty(options, 'data')
  }

  // support baseURL
  if (options.baseURL && typeof options.baseURL === 'string') {
    if(!isAbsoluteURL(options.url)) {
      options.url = combineURLs(options.baseURL, options.url)
    }
    Reflect.deleteProperty(options, 'baseURL')
  }

  // transform request options
  transformRequests.forEach(transformReqFn => {
    options = transformReqFn(options)
  })

  if(['post', 'put', 'patch'].indexOf(options.method) > -1) {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded'
  }

  const url = options.url || ''
  Reflect.deleteProperty(options, 'url')
  const timeout = options.tiemout || 0
  Reflect.deleteProperty(options, 'timeout')
  let requestPromise = window.fetch(url, options)
  if(timeout > 0) {
    requestPromise = Promise.race([
      requestPromise,
      new Promise(function (resolve, reject) {
        setTimeout(() => reject(createError('request timeout', EXCEPTION_TIMEOUT)), timeout)
      })
    ])
  }

  return requestPromise.then(response => {
    if(response.ok) {
      transformResponses.forEach(transformRespFn => {
        response = transformRespFn(response)
      })
      return response
    }
    throwError('response was not ok...', EXCEPTION_NETWORK)
  })
}

export default qiFetch
