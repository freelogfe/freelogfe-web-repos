
// 获取url：依赖子发行的数据内容
export function resolveSubDependDataUrl(presentableId, subDependId, entityNid){
  return resolveUrl(`/v1/presentable/${presentableId}/data/subDepend/${subDependId}`, { entityNid })
}

// 获取url：依赖子发行的信息
export function resolveSubDependInfoUrl(presentableId, subDependId, entityNid){
  return resolveUrl(`/v1/presentable/${presentableId}/info/subDepend/${subDependId}`, { entityNid })
}

// 获取url：节点发行(presentable)的数据内容
export function resolvePresentableDataUrl(presentableId) {
  return resolveUrl(`/v1/presentable/${presentableId}/data`)
}

function resolveUrl(path, params) {
  const { nodeType, qiOrigin } = window.FreelogApp.Env
  params = Object.assign({ nodeType }, params)
  var queryString = Object.entries(params).map(([k, v]) => {
    if (v != null) {
      return `${k}=${v}`
    } else {
      return ''
    }
  }).filter(str => str !== '').join('&')
  return `${qiOrigin}${path}?${queryString}`
}