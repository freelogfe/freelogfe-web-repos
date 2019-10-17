import { resolveSubResourceDataUrl, resolveSubReleaseInfoUrl } from './resolveUrl'
import { throwError, createError } from '../exceptions/throwError'
import { EXCEPTION_AUTH } from '../exceptions/names'
import { injectCodeResource } from '../helpers/index'

var _fetch = null
export default function init(fetch) {
  _fetch = fetch
}

/**
 * 获取节点的presentables列表
 */
export function fetchPresentablesList(params = {}) {
  return _fetch('/v1/presentables', { data: params })
          .then(resp => resp.json())
}

/**
 * 获取单个presentable的详情
 */
export function fetchPresentableInfo(presentableId) {
  return _fetch(`/v1/presentables/${presentableId}`)
          .then(resp => resp.json())
}

function fetchPresentableResource(target, params = {}) {
  return _fetch(`/v1/auths/presentables/${target}`, { data: params })
}

/**
 * 获取节点资源的数据内容
 */
export function fetchPresentableResourceData(presentableId, params) {
  return fetchPresentableResource(`${presentableId}.file`, params)
}

/**
 * 获取节点资源的授权信息
 */
export function fetchPresentableResourceInfo(presentableId, params) {
  return fetchPresentableResource(`${presentableId}.info`, params)
    .then(resp => resp.json())
}

/**
 * 获取节点资源的授权信息
 */
export function fetchPresentableAuth(presentableId, params) {
  var subReleases = []
  return fetchPresentableResource(`${presentableId}.auth`, params)
    .then(resp => {
      try {
        subReleases = window.atob(resp.headers.get('freelog-sub-releases'))
        subReleases = JSON.parse(subReleases)
      }catch(e) {
        console.warn(e)
      }
      return resp
    })
    .then(resp => resp.json())
    .then(res => {
      res.data.subReleases = subReleases
      return res
    })
}

/**
 * 获取presentable依赖的子发行的数据内容
 */
export function fetchSubReleaseData({presentableId, subReleaseId, version }) {
  const url = resolveSubResourceDataUrl({ presentableId, subReleaseId, version })
  return _fetch(url)
}

/**
 * 获取presentable依赖的子发行信息
 */
export function fetchSubResource({ presentableId, subReleaseId, version }) {
  const url = resolveSubReleaseInfoUrl({presentableId, subReleaseId, version})
  return _fetch(url).then(resp => resp.json())
}

export function fetchSubResourceData({ presentableId, subReleaseId, version }) {
  const url = resolveSubResourceDataUrl({ presentableId, subReleaseId, version })
  return _fetch(url)
}

export function requireSubResource({ presentableId, subReleaseId, version }) {
  const url = resolveSubResourceDataUrl({ presentableId, subReleaseId, version })
  var type
  return _fetch(url)
    .then(resp => {
      const contentType = resp.headers.get('content-type')
      if (/css/.test(contentType)) {
        type = 'text/css'
      } else if (/javascript/.test(contentType)) {
        type = 'text/javascript'
      }
      return resp.text()
    })
    .then(data => injectCodeResource(data, type))
}