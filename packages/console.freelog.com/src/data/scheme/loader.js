// import { createCacheLoaders } from '@/lib/utils'
import cloneDeep from 'lodash/cloneDeep'
import uniqBy from 'lodash/uniqBy'

import axios from '@/lib/axios'


const cachedResourceSchemes = {}
const cachedSchemes = {}

/**
 * @param params
 * @param params.authSchemeIds {Array}
 * @param params.resourceIds {Array}
 * @returns {*}
 */
function loadAuthSchemes(params) {
  const resourceIds = []
  if (params.resourceIds && params.resourceIds.length) {
    params.resourceIds.forEach((rid) => {
      resourceIds.push(rid)
      if (!cachedResourceSchemes[rid]) {
        cachedResourceSchemes[rid] = []
      }
    })
    params.resourceIds = resourceIds.join(',')
  }

  if (params.authSchemeIds && params.authSchemeIds.length) {
    params.authSchemeIds = params.authSchemeIds.join(',')
  }

  return axios.get('/v1/resources/authSchemes', {
    params
  }).then((res) => {
    if (res.data.errcode === 0) {
      const list = res.getData()
      list.forEach((scheme) => {
        if (!cachedSchemes[scheme.authSchemeId]) {
          cachedSchemes[scheme.authSchemeId] = scheme
        }

        if (params.resourceIds) {
          cachedResourceSchemes[scheme.resourceId].push(scheme)
        }
      })

      if (resourceIds.length) {
        resourceIds.forEach((rid) => {
          cachedResourceSchemes[rid] = uniqBy(cachedResourceSchemes[rid], 'authSchemeId')
        })
      }
      return cloneDeep(list)
    }
    return Promise.reject(res.data.msg)
  })
}

//
// const onloadSchemeDetail = createCacheLoaders(function (id) {
//   return loadAuthSchemes({authSchemeIds: [id]}).then(scheme => {
//     if (Array.isArray(scheme)) {
//       scheme = scheme[0]
//     }
//     return scheme
//   })
// }, true)


function onloadSchemeDetail(id) {
  return loadAuthSchemes({ authSchemeIds: [id] }).then((scheme) => {
    if (Array.isArray(scheme)) {
      scheme = scheme[0]
    }
    return scheme
  })
}
// const loadSchemesForResource = createCacheLoaders(function (params) {
//   return loadAuthSchemes(params)
// }, true)
function loadSchemesForResource(params) {
  return loadAuthSchemes(params)
}


function onloadSchemesForResource(id, params) {
  // if (cachedResourceSchemes[id] && !params) {
  //   return Promise.resolve(cloneDeep(cachedResourceSchemes[id]))
  // }

  params = params || {}
  params.resourceIds = [id]

  return loadSchemesForResource(params)
}

export {
  onloadSchemesForResource,
  onloadSchemeDetail,
  loadAuthSchemes
}

export default {
  onloadSchemesForResource,
  onloadSchemeDetail,
  loadAuthSchemes
}
