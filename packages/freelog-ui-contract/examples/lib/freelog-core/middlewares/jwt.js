/* eslint-disable */
import MiddlewareBase from './base'

export default class MiddlewareJWT extends MiddlewareBase {
  transformRequest(url, req) {
    req = req || {}
    if (!req.credentials) {
      req.credentials = 'same-origin'
    }
    return [url, req]
  }
}
