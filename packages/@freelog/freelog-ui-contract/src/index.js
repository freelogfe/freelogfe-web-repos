
import ContractSigningSingle from './components/contract-signing/signing-single.vue'
import ContractSigningDialog from './components/contract-signing/contract-signing-dialog.vue'
import ContractDetail from './components/contract-detail/index.vue'

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
