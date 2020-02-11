/**
 * 概念说明：
 * 1. 资源：即一个数据文件，可以是一个文本、图片、音频、视频和软件等；
 * 2. 资源详情：指一个资源的名称、描述、依赖、授权策略等信息的集合；
 * 3. presentable：即一个节点资源的别称，其映射一个资源，节点须与该资源签订合同后方可使用；节点可根据自身需求对presentable指定授权策略；
 * 4. presentable详情：指一个presentable的名称、描述、资源ID、合同状态、授权策略和标签等信息的集合；
 * 5. 节点资源详情：presentable映射资源的资源详情
 */
import * as helpers from './utils/helpers'

class APIGenerator {
  constructor(options) {
    this.fetch = options.fetch
    this.resourceLoadedState = new Map()
    this.resourceTokensMap = new Map()
    window.__auth_info__ = window.__auth_info__ || { __auth_user_id__: 10008, __auth_node_id__: 10017 }
    this.nodeId = __auth_info__.__auth_node_id__
    this.initTokens()
  }

  initTokens() {
    if (!window.__auth_info__) return
    const token = window.__auth_info__.__page_build_sub_resource_auth_token
    const rids = window.__auth_info__.__page_build_sub_resource_ids || []

    if (rids.length && token) {
      rids.forEach((rid) => {
        this.setResourceToken(rid, token)
      })
    }
  }

  getResourceToken(resourceId) {
    return this.resourceTokensMap.get(resourceId)
  }

  setResourceToken(resourceId, token) {
    this.resourceTokensMap.set(resourceId, token)
  }

  getResourceLoaderState(resourceId) {
    return this.resourceLoadedState.get(resourceId)
  }

  setResourceLoaderState(resourceId, data) {
    this.resourceLoadedState.set(resourceId, data)
  }

  getSubResourceUrl(resourceId, token) {
    return `/api/v1/auths/presentable/subResource/${resourceId}?token=${token}`
  }

  getPresentableUrl(presentableId) {
    return `/api/v1/auths/presentable/${presentableId}?nodeId=${this.nodeId}`
  }

  // 获取节点的presentables列表
  fetchPresentablesList(params = {}) {
    params = Object.assign({ nodeId: this.nodeId }, params)
    return this.fetch('/v1/presentables', { data: params })
      .then(resp => resp.json())
  }

  // 获取单个presentable的详情
  fetchPresentableInfo(presentableId) {
    return this.fetch(`/v1/presentables/${presentableId}`)
      .then(resp => resp.json())
  }

  fetchPresentableResource(target, params = {}) {
    const url = `/v1/auths/presentable/${target}`

    params = Object.assign({ nodeId: this.nodeId }, params)
    return this.fetch(url, { data: params })
      .then((resp) => {
        const headers = resp.headers
        const rids = headers.get('freelog-sub-resourceids')
        const token = headers.get('freelog-sub-resource-auth-token')

        if (rids && token) {
          rids.split(',').forEach((id) => {
            this.setResourceToken(id, token)
          })
        }

        return resp
      })
  }

  // 获取节点资源的数据内容
  fetchPresentableResourceData(presentableId, params) {
    return this.fetchPresentableResource(`${presentableId}`, params)
  }

  // 获取节点资源的详情信息
  fetchPresentableResourceInfo(presentableId, params) {
    return this.fetchPresentableResource(`${presentableId}.info`, params)
      .then(resp => resp.json())
  }

  fetchSubResource(resourceId) {
    return this.resolveResourceUrl({ resourceId })
      .then(resourceUrl => fetch(resourceUrl))
  }

  /**
   * js/css/json
   * @param resourceId
   * @param token
   * @returns {*}
   */
  requireSubResource(resourceId, token) {
    // 已经加载的资源不再加载
    if (this.getResourceLoaderState(resourceId)) {
      return Promise.resolve(this.getResourceLoaderState(resourceId))
    }

    let type
    let promise = null

    if (token) {
      const resourceUrl = this.getSubResourceUrl(resourceId, token)
      promise = fetch(resourceUrl)
      this.setResourceToken(resourceId, token)
    } else {
      promise = this.fetchSubResource(resourceId)
    }

    return promise
      .then((resp) => {
        const contentType = resp.headers.get('content-type')
        if (/css/.test(contentType)) {
          type = 'text/css'
        } else if (/javascript/.test(contentType)) {
          type = 'text/javascript'
        }

        return type ? resp.text() : resp.json()
      })
      .then((data) => {
        if (typeof data.errcode === 'undefined') {
          if (typeof data === 'object') {
            this.setResourceLoaderState(resourceId, data)
            return data
          }
          return helpers.injectCodeResource(data, type)
            .then(() => this.setResourceLoaderState(resourceId, data))
        }
        throw new Error(JSON.stringify(data))
      })
  }

  resolveResourceUrl({ presentableId, resourceId }) {
    if (resourceId) {
      let token = this.getResourceToken(resourceId)
      if (token) {
        return Promise.resolve(this.getSubResourceUrl(resourceId, token))
      }

      if (presentableId) {
        return this.fetchPresentableResource(`${presentableId}`)
          .then(resp => resp.json())
          .then(() => {
            token = this.getResourceToken(resourceId)
            if (token) {
              return this.getSubResourceUrl(resourceId, token)
            }
            throw new Error('no found token!')
          })
      }
    } else if (presentableId) {
      return Promise.resolve(this.getPresentableUrl(presentableId))
    }
    return Promise.reject('no found token!')
  }

}

export default function createApi(fetch) {

  var apiGen = new APIGenerator({ fetch })

  return {
    fetchPresentablesList() {
      return apiGen.fetchPresentablesList.apply(apiGen, arguments)
    },
    fetchPresentableInfo() {
      return apiGen.fetchPresentableInfo.apply(apiGen, arguments)
    },
    fetchPresentableResourceData() {
      return apiGen.fetchPresentableResourceData.apply(apiGen, arguments)
    },
    fetchPresentableResourceInfo() {
      return apiGen.fetchPresentableResourceInfo.apply(apiGen, arguments)
    },
    fetchSubResource() {
      return apiGen.fetchSubResource.apply(apiGen, arguments)
    },
    requireSubResource() {
      return apiGen.requireSubResource.apply(apiGen, arguments)
    },
    resolveResourceUrl() {
      return apiGen.resolveResourceUrl.apply(apiGen, arguments)
    }
  }
}

