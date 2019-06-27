import MiddlewareAuth from './middlewares/auth'
import MiddlewareFetch from './middlewares/resolveReq'
import MiddlewareJWT from './middlewares/jwt'

import QICore from './QI-core'
import createApi from './api'

const _QI = new QICore()
  .use(new MiddlewareAuth())
  .use(new MiddlewareFetch())
  .use(new MiddlewareJWT())
const fetch = _QI.fetch.bind(_QI)

window.FreelogApp = window.FreelogApp || {}
Object.defineProperty(window.FreelogApp, 'QI', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: Object.freeze({
    fetch,
    ...createApi(fetch),
  })
})

