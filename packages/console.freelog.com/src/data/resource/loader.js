import { ResourceService } from '@/services'
// import { createCacheLoaders } from '@/lib/utils'
// import cloneDeep from 'lodash/cloneDeep'
import axios from '@/lib/axios'

// const cachedResources = {}


function loadDetail(resourceId) {
  return ResourceService.get(resourceId).then((res) => {
    if (res.data.errcode === 0) {
      return res.getData()
    }
    return Promise.reject(res.data)
  })
}

function loadResources(resourceIds) {
  // const result = []
  // const rids = []
  // resourceIds.forEach(rid => {
  //   if (cachedResources[rid]) {
  //     result.push(cloneDeep(cachedResources[rid]))
  //   } else {
  //     rids.push(rid)
  //   }
  // });
  //
  // if (!rids.length) {
  //   return Promise.resolve(result)
  // }

  return axios.get('/v1/resources/list', {
    params: {
      resourceIds: resourceIds.join(',')
    }
  }).then((res) => {
    const data = res.getData()
    // if (data) {
    //   data.forEach(res => {
    //     cachedResources[res.resourceId] = res
    //     result.push(cloneDeep(res))
    //   })
    // }
    return data
  })
}

//
// const onloadResourceDetail = createCacheLoaders(function (resourceId) {
//   if (cachedResources[resourceId]) {
//     return Promise.resolve(cachedResources[resourceId])
//   }
//   return loadDetail(resourceId).then(res => {
//     cachedResources[resourceId] = res
//     return res
//   });
// }, true)


function onloadResourceDetail(resourceId) {
  return loadDetail(resourceId).then(res => res)
}

export {
  loadDetail,
  onloadResourceDetail,
  loadResources
}

export default {
  loadDetail,
  loadResources,
  onloadResourceDetail
}
