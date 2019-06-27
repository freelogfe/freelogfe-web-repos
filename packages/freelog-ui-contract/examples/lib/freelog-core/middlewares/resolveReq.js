/* eslint-disable */
import * as util from '../utils/util'
import MiddlewareBase from './base'

export default class MiddlewareFetch extends MiddlewareBase {
  transformRequest(url, req) {
    req = req || {}
    const method = (req.method || 'get').toLowerCase()
    if (req.data) {
      if (method === 'get') {
        const qs = util.getQueryString(req.data)
        url += (url.indexOf('?') > -1 ? '&' : '?') + qs
      } else {
        const headers = req.headers || {}
        const data = req.data
        let body
        if (util.isFormData(data) ||
                    util.isArrayBuffer(data) ||
                    util.isStream(data) ||
                    util.isFile(data) ||
                    util.isBlob(data)) {
          body = data
        } else if (util.isArrayBufferView(data)) {
          body = data.buffer
        } else if (util.isURLSearchParams(data)) {
          this.setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8')
          body = data.toString()
        } else if (util.isObject(data)) {
          this.setContentTypeIfUnset(headers, 'application/json;charset=utf-8')
          body = JSON.stringify(data)
        }
        req.headers = headers
        req.body = body
      }
      delete req.data
    }
    return [url, req]
  }

  transformResponse(resp) {
    // const headers = resp.headers
    // const rids = headers.get('freelog-sub-resourceids')
    return resp
  }

  setContentTypeIfUnset(headers, value) {
    if (!headers['content-type'] && !headers['Content-Type']) {
      headers['Content-Type'] = value
    }
  }
}
