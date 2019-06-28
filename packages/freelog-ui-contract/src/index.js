
import ContractSigningSingle from './components/contract-signing/signing-single'
import ContractSigningDialog from './components/contract-signing/contract-signing-dialog'
import ContractDetail from './components/contract-detail/index'

export {
  ContractSigningSingle,
  ContractDetail,
  ContractSigningDialog
}

export default {
  install(Vue) {
    Vue.component(ContractSigningSingle.name, ContractSigningSingle)
    Vue.component(ContractDetail.name, ContractDetail)
    Vue.component(ContractSigningDialog.name, ContractSigningDialog)
  }
}
