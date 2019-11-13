import { resolveSubResourceDataUrl, resolveSubReleaseInfoUrl } from './resolveUrl'
import { throwError, createError } from '../exceptions/throwError'
import { EXCEPTION_AUTH } from '../exceptions/names'
import { injectCodeResource } from '../helpers/index'

const HEADERS_FREELOG_SUB_RELEASE = 'freelog-sub-releases'

var _fetch = null
export default function init(fetch) {
  _fetch = fetch
}

/**
 * 获取节点的presentables列表
 */
export function fetchPresentablesList(params = {}) {
  return fetchPresentablesAuthList(params)
    .then(res => {
      if(res.errcode === 0) {
        res.data.dataList = res.data.dataList.map(p => {
          const authResult = p.authResult 
          if(authResult != null) {
            try {
              const fSubReleases = Buffer.from(authResult[HEADERS_FREELOG_SUB_RELEASE], 'base64').toString('utf-8')
              authResult[HEADERS_FREELOG_SUB_RELEASE] = JSON.parse(fSubReleases)
              console.log('fSubReleases --', fSubReleases)
            }catch(e) {
              console.warn(e)
              authResult[HEADERS_FREELOG_SUB_RELEASE] = []
            }
          }
          return p
        })
      }
      return res
    })
}

export function fetchPresentablesAuthList(params = {}) {
  return _fetch('/v1/presentables/authList', { data: params })
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
  return _fetch(`/v1/auths/presentable/${target}`, { data: params })
}

/**
 * 获取节点资源的数据内容
 */
export function fetchPresentableResourceData(id, params = {}) {
  return _fetch(`/v1/auths/presentable/data/${id}`, { data: params })
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
        const fSubReleases = resp.headers.get(HEADERS_FREELOG_SUB_RELEASE)
        subReleases = Buffer.from(fSubReleases,'base64').toString('utf-8')
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
export function fetchSubReleaseData(presentableId, subReleaseId, version) {
  const url = resolveSubResourceDataUrl(presentableId, subReleaseId, version)
  return _fetch(url)
}

/**
 * 获取presentable依赖的子发行信息
 */
export function fetchSubResource(presentableId, subReleaseId, version) {
  const url = resolveSubReleaseInfoUrl({presentableId, subReleaseId, version})
  return _fetch(url).then(resp => resp.json())
}

export function fetchSubResourceData(presentableId, subReleaseId, version) {
  const url = resolveSubResourceDataUrl(presentableId, subReleaseId, version)
  return _fetch(url)
}

export function requireSubResource(presentableId, subReleaseId, version) {
  const url = resolveSubResourceDataUrl(presentableId, subReleaseId, version)
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