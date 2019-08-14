import generateInterfaces from './interface'
import { resolvePresentableDataUrl } from './resolveUrl'
import { getUserInfo, checkUserIsLogin } from './resolveUserInfo'

export default function generateAPIs(QI) {
  const authInfo = window.__auth_info__ || {}
  const nodeId = authInfo.__auth_node_id__

  const _fetch = QI.create({
    baseURL: window.FreelogApp.Env.qiOrigin,
    timeout: 1000,
    data: {nodeId}
  })

  let interfaces = generateInterfaces(_fetch)

  return Object.assign({
    resolvePresentableDataUrl,
    getUserInfo,
    checkUserIsLogin
  }, exposeInterfaces(interfaces))
}


function exposeInterfaces(interfaces) {
  const api = {}
  const apiList =  [
    'fetchPresentablesList', 'fetchPresentableInfo', 'fetchPresentableResourceData', 'fetchPresentableResourceInfo',
    'fetchSubResourceUrl', 'fetchSubResource', 'requireSubResource', 'fetchSubResourceData', 'fetchPresentableAuth', 'fetchSubReleaseData', 
    'getPresentableResourceUrl'
  ]

  apiList.forEach((name) => {
    api[name] = function (...args) {
      return interfaces[name](...args)
    }
  })

  // 向后兼容（兼容之前版本的api）
  api['resolveResourceUrl'] = function({ resourceId, presentableId }) {
    return interfaces['fetchSubResourceUrl'](resourceId, presentableId)
  }
  return api
}
