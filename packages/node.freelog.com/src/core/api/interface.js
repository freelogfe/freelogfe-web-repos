import { resolveSubDependDataUrl, resolveSubDependInfoUrl } from './resolveUrl'
import { throwError, createError } from '../exceptions/throwError'
import { EXCEPTION_AUTH } from '../exceptions/names'
import { injectCodeResource } from '../helpers/index'

const HEADERS_FREELOG_SUB_RELEASE = 'freelog-sub-releases'

var _fetch = window.fetch
export default function init(fetch) {
  _fetch = fetch
}

/**
 * 分页获取节点Presentable列表
 * @param {Object} params 
 */
export function pagingGetPresentables(params) {
  return _fetch('/v1/presentables/authList', { data: params })
    .then(resp => resp.json())
}

/**
 * 获取单个presentable
 * @param {String} presentableId 
 */
export function getPresentable(presentableId) {
  return _fetch(`/v1/presentable/${presentableId}/info`)
    .then(resp => resp.json())
}

/**
 * 获取单个presentable授权
 * @param {string} presentableId  
 */
export function getPresentableAuth(presentableId) {
  var subReleases = []
  return _fetch(`/v1/presentable/${presentableId}/auth`)
    .then(resp => resp.json())
    .then(res => {
      if(res.errcode === 0 && res.data) {
        const fSubReleases = res.data[HEADERS_FREELOG_SUB_RELEASE]
        subReleases = Buffer.from(fSubReleases,'base64').toString('utf-8')
        subReleases = JSON.parse(subReleases) 
        res.data.subReleases = subReleases
      }
      return res
    })
}

/**
 * 获取单个presentable资源数据
 * @param {string} presentableId  
 */
export function getPresentableData(presentableId) {
  return _fetch(`/v1/presentable/${presentableId}/data`)
}

/**
 * 通过releaseNames或relealseIds批量获取节点Presentable
 * @param {Object} params 
 */
export function batchGetPresentables(params) {
  const nodeId = window.__auth_info__.__auth_node_id__
  return _fetch(`/v1/${nodeId}/presentables/authList`, { data: params })
    .then(resp => resp.json())
}

/**
 * 获取presentable子依赖的数据内容
 */
export function getPresnetableSubDependData(presentableId, subDependId, entityNid) {
  const url = resolveSubDependDataUrl(presentableId, subDependId, entityNid)
  return _fetch(url)
}

/**
 * 获取presentable子依赖的信息
 */
export function getPresnetableSubDependInfo(presentableId, subDependId, entityNid) {
  const url = resolveSubDependInfoUrl({presentableId, subDependId, entityNid})
  return _fetch(url).then(resp => resp.json())
}

export function requireSubDepend(presentableId, subDependId, entityNid) {
  const url = resolveSubDependDataUrl(presentableId, subDependId, entityNid)
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