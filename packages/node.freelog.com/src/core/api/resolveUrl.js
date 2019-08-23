
// 获取url：依赖子发行的数据内容
export function resolveSubResourceDataUrl({ presentableId, subReleaseId, version }){
  return `${window.FreelogApp.Env.qiOrigin}/v1/auths/presentables/${presentableId}/subRelease/${subReleaseId}.file?version=${version}`
}

// 获取url：依赖子发行的信息
export function resolveSubReleaseInfoUrl({ presentableId, subReleaseId, version }){
  return `${window.FreelogApp.Env.qiOrigin}/v1/auths/presentables/${presentableId}/subRelease/${subReleaseId}.info?version=${version}`
}

// 获取url：节点发行(presentable)的数据内容
export function resolvePresentableResourceUrl(presentableId) {
  return `${window.FreelogApp.Env.qiOrigin}/v1/auths/presentables/${presentableId}.file`
}