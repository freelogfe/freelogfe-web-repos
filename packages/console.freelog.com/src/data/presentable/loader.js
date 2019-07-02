import { PresentablesService } from '@/services'
// import { createLoader, createCacheLoaders } from '@/lib/utils'


function onloadPresentableDetail(pid) {
  return PresentablesService.get(pid).then(res => res.getData())
}

// const onloadPresentableDetail = createCacheLoaders(loadDetail, true)

export {
  onloadPresentableDetail
}

export default {
  onloadPresentableDetail
}
