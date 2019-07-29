import { getSubResourceUrl } from './resolveUrl'
import { throwError, createError } from '../exceptions/throwError'
import { EXCEPTION_AUTH } from '../exceptions/names'
import { injectCodeResource } from '../helpers/index'

export default function generateInterfaces(fetch) {
  const subResourceTokenMap = initTokens()
  const resourceLoadedStateMap = new Map()

  function initTokens() {
    const tokenMap = new Map()
    if (window.__auth_info__) {
      const token = window.__auth_info__.__page_build_sub_resource_auth_token
      const rids = window.__auth_info__.__page_build_sub_resource_ids || []
      if (rids.length && token) {
        rids.forEach((rid) => {
          tokenMap.set(rid, token)
        })
      }
    }
    return tokenMap
  }

  const interfaces = {
    /**
     * 获取节点的presentables列表
     */
    fetchPresentablesList(params = {}) {
      return fetch('/v1/presentables', { data: params })
        .then(resp => resp.json())
    },

    /**
     * 获取单个presentable的详情
     */
    fetchPresentableInfo(presentableId) {
      return fetch(`/v1/presentables/${presentableId}`)
        .then(resp => resp.json())
    },

    fetchPresentableResource(target, params = {}) {
      return fetch(`/v1/auths/presentables/${target}`, { data: params })
        .then((resp) => {
          const headers = resp.headers
          const rids = headers.get('freelog-sub-releases')
          const token = headers.get('freelog-sub-resource-auth-token')

          return resp
        })
    },

    /**
     * 获取节点资源的数据内容
     */
    fetchPresentableResourceData(presentableId, params) {
      return interfaces.fetchPresentableResource(`${presentableId}.file`, params)
    },

    /**
     * 获取节点资源的授权信息
     */
    fetchPresentableResourceInfo(presentableId, params) {
      return interfaces.fetchPresentableResource(`${presentableId}.info`, params)
        .then(resp => resp.json())
    },

    /**
     * 获取节点资源的授权信息
     */
    fetchPresentableAuth(presentableId, params) {
      return interfaces.fetchPresentableResource(`${presentableId}.auth`, params)
        .then(resp => resp.json())
    },

    fetchSubResourceUrl(subResourceId = '', presentableId = '') {
      let token = subResourceTokenMap.get(subResourceId)
      if(token) {
        return Promise.resolve(getSubResourceUrl(subResourceId, token))
      }

      const authErrorMsg = `子资源(${subResourceId})存在授权问题！`
      if(presentableId){
        return interfaces.fetchPresentableResource(`${presentableId}.info`)
          .then(() => {
            let token = subResourceTokenMap.get(subResourceId)
            if(token) {
              return Promise.resolve(getSubResourceUrl(subResourceId, token))
            }
            throwError(authErrorMsg, EXCEPTION_AUTH)
          })
      }
      return Promise.reject(createError(authErrorMsg, EXCEPTION_AUTH))
    },

    fetchSubResource({ presentableId, subReleaseId, version }) {
      const url = `/v1/auths/presentables/${presentableId}/subRelease/${subReleaseId}.info?version=${version}`
      return fetch(url).then(resp => resp.json())
    },

    fetchSubResourceData({ presentableId, subReleaseId, version }) {
      const url = `/v1/auths/presentables/${presentableId}/subRelease/${subReleaseId}.file?version=${version}`
      return fetch(url)
    },

    requireSubResource({ presentableId, subReleaseId, version }) {
      const url = `/v1/auths/presentables/${presentableId}/subRelease/${subReleaseId}.file?version=${version}`
      var type
      return fetch(url)
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
    },


  }
  return interfaces

}
