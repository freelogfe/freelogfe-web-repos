import { ContractService } from '@/services'
// import { createLoader, createCacheLoaders } from '@/lib/utils'

function loadDetail(id) {
  return ContractService.get(id).then(res => res.getData())
}

// const onloadContractDetail = createCacheLoaders(loadDetail)
const onloadContractDetail = loadDetail

export {
  loadDetail,
  onloadContractDetail
}

export default {
  loadDetail,
  onloadContractDetail
}
