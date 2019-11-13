
// 获取url：依赖子发行的数据内容
export function resolveSubResourceDataUrl(presentableId, subDependId, version){
  return resolveUrl(`/v1/auths/presentable/data/${presentableId}/subDepend/${subDependId}`, {
    version
  })
}

// 获取url：依赖子发行的信息
export function resolveSubReleaseInfoUrl({ presentableId, subReleaseId, version }){
  return resolveUrl(`/v1/auths/presentables/${presentableId}/subRelease/${subReleaseId}.info`, {
    version
  })
}

// 获取url：节点发行(presentable)的数据内容
export function resolvePresentableResourceUrl(presentableId) {
  return resolveUrl(`/v1/auths/presentable/data/${presentableId}`)
}

function resolveUrl(path, params) {
  const { nodeType, qiOrigin } = window.FreelogApp.Env
  params = Object.assign({ nodeType }, params)
  var queryString = Object.entries(params).map(([k, v]) => {
    return `${k}=${v}`
  }).join('&')
  return `${qiOrigin}${path}?${queryString}`
}