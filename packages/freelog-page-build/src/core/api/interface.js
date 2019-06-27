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
      return fetch(`/v1/auths/presentable/${target}`, { data: params })
        .then((resp) => {
          const headers = resp.headers
          const rids = headers.get('freelog-sub-resourceids')
          const token = headers.get('freelog-sub-resource-auth-token')

          if (rids && token) {
            rids.split(',').forEach((id) => {
              subResourceTokenMap.set(id, token)
            })
          }

          return resp
        })
    },

    /**
     * 获取节点资源的数据内容
     */
    fetchPresentableResourceData(presentableId, params) {
      return interfaces.fetchPresentableResource(`${presentableId}`, params)
    },

    /**
     * 获取节点资源的详情信息
     */
    fetchPresentableResourceInfo(presentableId, params) {
      return interfaces.fetchPresentableResource(`${presentableId}.info`, params)
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
      return load(url).then(resp => resp.json())
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

    /**
     * js/css/json
     * @param resourceId
     * @param token
     * @returns {*}
     */
    // requireSubResource(resourceId, presentableId) {
    //   // 已经加载的资源不再加载
    //   if (resourceLoadedStateMap.get(resourceId)) {
    //     return Promise.resolve(resourceLoadedStateMap.get(resourceId))
    //   }
    //
    //   let type
    //   return interfaces.fetchSubResource(resourceId, presentableId)
    //   .then((resp) => {
    //     const contentType = resp.headers.get('content-type')
    //     if (/css/.test(contentType)) {
    //       type = 'text/css'
    //     } else if (/javascript/.test(contentType)) {
    //       type = 'text/javascript'
    //     }
    //
    //     return type ? resp.text() : resp.json()
    //   })
    //   .then((data) => {
    //     if (typeof data.errcode === 'undefined') {
    //       if (typeof data === 'object') {
    //         resourceLoadedStateMap.set(resourceId, data)
    //         return data
    //       }
    //       return injectCodeResource(data, type)
    //       .then(() => resourceLoadedStateMap.set(resourceId, data))
    //     }
    //     return Promise.reject(JSON.stringify(data))
    //   })
    // },
  }
  return interfaces

}
