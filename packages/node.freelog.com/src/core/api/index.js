import initInterfaces, * as _interfaces from './interface'
import { resolveSubResourceDataUrl, resolveSubReleaseInfoUrl, resolvePresentableResourceUrl } from './resolveUrl'
import { getUserInfo, checkUserIsLogin } from './resolveUserInfo'

export default function generateAPIs(QI) {
  const authInfo = window.__auth_info__ || {}
  const nodeId = authInfo.__auth_node_id__

  const _fetch = QI.create({
    baseURL: window.FreelogApp.Env.qiOrigin,
    timeout: 1000,
    data: {nodeId}
  })

  initInterfaces(_fetch)
  return Object.assign({
    resolveSubResourceDataUrl,
    resolveSubReleaseInfoUrl,
    resolvePresentableResourceUrl,
    getUserInfo,
    checkUserIsLogin
  }, exposeInterfaces(_interfaces))
}


function exposeInterfaces(interfaces) {
  const api = {}

  Object.keys(interfaces).forEach((name) => {
    api[name] = function (...args) {
      return interfaces[name](...args)
    }
  })

  // 向后兼容（兼容之前版本的api）
  api['resolveResourceUrl'] = function({ resourceId, presentableId }) {
    return resolveSubResourceDataUrl(resourceId, presentableId)
  }
  return api
}
