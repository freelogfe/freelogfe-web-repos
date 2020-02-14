import initInterfaces, * as _interfaces from './interface'
import { resolveSubDependDataUrl, resolveSubDependInfoUrl, resolvePresentableDataUrl } from './resolveUrl'
import { getUserInfo, checkUserIsLogin } from './resolveUserInfo'

export default function generateAPIs(QI) {
  const authInfo = window.__auth_info__ || {}
  const nodeId = authInfo.__auth_node_id__
  const nodeType = window.FreelogApp.Env.nodeType

  const _fetch = QI.create({
    baseURL: window.FreelogApp.Env.qiOrigin,
    timeout: 1000,
    data: { nodeId, nodeType }
  })

  initInterfaces(_fetch)
  return Object.assign({
    resolveSubDependDataUrl, resolveSubDependInfoUrl, resolvePresentableDataUrl,
    getUserInfo, checkUserIsLogin,
  }, exposeInterfaces(_interfaces))
}

function exposeInterfaces(interfaces) {
  const api = {}

  Object.keys(interfaces).forEach((name) => {
    if (name !== "default") {
      api[name] = function (...args) {
        return interfaces[name](...args)
      }
    }
  })
  return api
}
