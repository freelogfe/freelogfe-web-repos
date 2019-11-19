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
              if (authResult[HEADERS_FREELOG_SUB_RELEASE]) {
                const fSubReleases = Buffer.from(authResult[HEADERS_FREELOG_SUB_RELEASE], 'base64').toString('utf-8')
                authResult[HEADERS_FREELOG_SUB_RELEASE] = JSON.parse(fSubReleases)
              }
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

/**
 * 获取节点资源的数据内容
 */
export function fetchPresentableResourceData(id, params = {}) {
  return _fetch(`/v1/presentable/data/${id}`, { data: params })
}

/**
 * 获取节点资源的授权信息
 */
export function fetchPresentableResourceInfo(presentableId, params) {
  return _fetch(`/v1/auths/presentable/${presentableId}.info`, params)
    .then(resp => resp.json())
}

/**
 * 获取节点资源的授权信息
 */
export function fetchPresentableAuth(presentableId, params) {
  var subReleases = []
  return _fetch(`/v1/presentable/auth/${presentableId}`, params)
    .then(resp => resp.json())
    .then(res => {
      if(res.errcode === 0 && res.data) {
        const fSubReleases = res.data[HEADERS_FREELOG_SUB_RELEASE]
        subReleases = Buffer.from(fSubReleases,'base64').toString('utf-8')
        subReleases = JSON.parse(subReleases) 
        res.data.subReleases = subReleases
      }
      console.log(res)
      return res
    })
}

/**
 * 获取presentable依赖的子发行的数据内容
 */
export function fetchSubReleaseData(presentableId, subReleaseId, version, entityNid) {
  const url = resolveSubResourceDataUrl(presentableId, subReleaseId, version, entityNid)
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