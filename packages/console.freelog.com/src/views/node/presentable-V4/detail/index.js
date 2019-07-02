import PolicyList from '@/components/PolicyList/index.vue'
import ContractManager from '@/components/ContractManager/index.vue'
import AuthorizationSchemeManage from "@/components/Authorization-scheme/index.vue"

import {onloadSchemeDetail} from '@/data/scheme/loader'
import {onloadPresentableDetail} from '@/data/presentable/loader'

import PresentableDetailHeader from './header.vue'
import PresentableDetailBase from './base.vue'


const TAB_NAMES = {
  policy: 'policy-manager',
  contract: 'contract-manager',
  base: 'base-manager',
  scheme: 'scheme-manager'
}

export default {
  name: 'presentable-detail',
  data() {
    return {
      params: {},
      loading: false,
      TAB_NAMES,
      activeTabName: TAB_NAMES.base, //contract-manager, scheme-manager
      releaseInfo: {},
      presentableInfo: {
        policies: [],
        contracts: [],
        resolveReleases: []
      }
    }
  },

  components: {
    AuthorizationSchemeManage,
    PresentableDetailHeader,
    PolicyList,
    ContractManager,
    PresentableDetailBase,
  },

  computed: {
    isDependenciesDone() {
      return this.presentableInfo.resolveReleases.length > 0
    },
    isContractsDone() {
      const {contracts} = this.presentableInfo

      var isValid = true
      if (contracts && contracts.length > 0) {
        isValid = contracts.every(contract => {
          return contract.status === 4
        })
      }

      return isValid
    },
    isPoliciesDone() {
      return this.presentableInfo.policies.length > 0
    },
  },

  watch: {
    ['presentableInfo.contracts']() {

    },
    $route() {
      this.setActiveTab(this.$route.query.tab)
    }
  },

  mounted() {
    this.initView()
  },
  methods: {
    initView() {
      this.params = this.$route.params
      if (!this.params.presentableId) {
        return this.$error.showErrorMessage(this.$t('presentable.paramError'))
      }

      this.setActiveTab(this.$route.query.tab)

      this.loadPresentableData(this.params)
        // .then(this.loadPresentableScheme.bind(this))
    },
    setActiveTab(tab) {
      var activeTab
      if (Object.values(TAB_NAMES).includes(tab)) {
        activeTab = tab
      } else if (Object.keys(TAB_NAMES).includes(tab)) {
        activeTab = TAB_NAMES[tab]
      }

      if (this.activeTabName !== activeTab) {
        this.activeTabName = activeTab
      }
    },
    loadPresentableData(params) {
      return onloadPresentableDetail(params.presentableId)
        .then(presentable => {

          this.presentableInfo = Object.assign({}, this.presentableInfo, presentable)
          this.fetchReleaseDetail(presentable.releaseInfo.releaseId)
          this.getPresentableContracts()
        })
    },
    fetchReleaseDetail(releaseId) {
      this.$services.ReleaseService.get(releaseId)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.releaseInfo = res.data
          }
        }).catch(this.$error.showErrorMessage)
    },
    loadPresentableScheme() {
      const contract = this.getPresentableContract()
      if (contract) {
        onloadSchemeDetail(contract.authSchemeId).then((scheme) => {
          this.getPresentableScheme({contract, scheme})
        })
      }
    },
    getPresentableContracts() {
      const { resolveReleases = [] } = this.presentableInfo
      var targContracts = []
      const leng = resolveReleases.length
      for(let i = 0; i < leng; i++) {
        let { releaseId, releaseName, contracts } = resolveReleases[i]
        targContracts = [ ...targContracts, ...contracts.map(c => {
          c.releaseName = releaseName
          c.releaseId = releaseId
          return c
        }) ]
      }
      this.presentableInfo.contracts = targContracts
    },
    getPresentableContract() {
      const contracts = this.presentableInfo.contracts || []
      if (contracts.length) {
        let contract
        for (let i = 0; i < contracts.length; i += 1) {
          contract = contracts[i]
          if (contract.resourceId === this.presentableInfo.resourceId) {
            return contract
          }
        }
      }

      return null
    },
    getPresentableScheme({contract, scheme}) {
      const tempScheme = {...scheme}
      if (tempScheme) {
        for (let i = 0; i < tempScheme.policy.length; i += 1) {
          const policy = tempScheme.policy[i]
          let segmentId = contract.segmentId || contract.policySegmentId

          if (policy.segmentId === segmentId) {
            tempScheme.selectedPolicy = policy
            break
          }
        }

        this.$set(this.presentableInfo, 'scheme', tempScheme)
      }
    },
    updateSelectedScheme(scheme, contract) {
      this.getPresentableScheme({contract, scheme})
    },
    handleClick() {
      this.$router.push({
        path: `/node/${this.$route.params.nodeId}/presentable/${this.presentableInfo.presentableId}`,
        query: {tab: this.activeTabName}
      })
    },
    savePoliciesHandler({data}) {

      this.$services.presentables.put(this.$route.params.presentableId, data)
        .then(res => {
          const {errcode, ret, msg, data} = res.data
          if (errcode === 0 && ret === 0) {
            this.presentableInfo.policies = data.policies
          } else {
            this.$error.showErrorMessage(msg)
          }
        })
    },
    contractsChangeHandler(contracts) {
      this.$set(this.presentableInfo, 'contracts', contracts)
    }
  }
}
