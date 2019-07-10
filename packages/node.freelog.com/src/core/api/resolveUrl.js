
export function resolvePresentableDataUrl(presentableId = '') {
  const authInfo = window.__auth_info__ || {}
  const nodeId = authInfo.__auth_node_id__ || ''
  return `${window.FreelogApp.Env.qiOrigin}/v1/auths/presentable/${presentableId}?nodeId=${nodeId}`
}

export function getSubResourceUrl(resourceId, token) {
  return `${window.FreelogApp.Env.qiOrigin}/v1/auths/presentable/subResource/${resourceId}?token=${token}`
}

