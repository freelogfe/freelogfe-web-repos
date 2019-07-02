import TableView from '@/components/TableView/index.vue'
import ContractUtils from '@/data/contract/utils'
// import {loadResources} from '@/data/resource/loader'
import ContractDetail from '@/components/ContractDetail/index.vue'

export default {
  name: 'fl-contract-manager',
  data() {
    return {
      // contracts: [],
      query: '',
      currentContract: {},
      contractList: [],
      masterContract: {},
      loading: false
    }
  },
  components: {
    TableView,
    ContractDetail
  },

  props: {
    contracts: Array
  },

  watch: {
    contracts(newContracts, oldContracts) {
      const newCIds = newContracts.map(c => c.contractId)
      const oldCIds = oldContracts.map(c => c.contractId)
      for(let i = 0; i < newCIds.length; i++) {
        if(oldCIds.indexOf(newCIds[i]) === -1) {
          this.initView()
          break
        }
      }
    }
  },

  mounted() {
    if (this.contracts) {
      this.initView()
    }
  },

  methods: {
    initView() {
      if (!this.contracts.length || this.shouldUpdate() === false) return

      this.masterContract = {}
      const query = this.$route.query
      Object.assign(query, this.$route.params)
      this.loading = true
      this.loadData(query)
        .then(this.formatContracts)
        .then((contractList) => {
          this.contractList = contractList
          if (this.masterContract.contractId) {
            this.showContractDetailHandler(this.masterContract)
          } else if (contractList.length) {
            this.showContractDetailHandler(contractList[0])
          }

          this.fireContractsChange()
        })
        .finally(() => {
          this.loading = false
          this.shouldUpdate()  //更新key值
        })
    },
    //避免重复请求合同数据
    shouldUpdate() {
      var updateKey = this.contracts.map(contract => {
        return `${contract.contractId}`
      }).join('_')

      if (this.updateKey !== updateKey) {
        this.updateKey = updateKey
        return true
      } else {
        return false
      }
    },
    formatContracts({contracts, releases}) {
      var releasesMap = {}
      var contractList = []

      releases.forEach(release => {
        releasesMap[release.releaseId] = release
      })

      contracts.forEach((contract) => {
        contract.releaseDetail = releasesMap[contract.partyOne]
        if (contract.contractId === this.masterContract.contractId) {
          Object.assign(this.masterContract, contract)
          ContractUtils.format(this.masterContract)
        } else {
          ContractUtils.format(contract)
          contractList.push(contract)
        }
      })
      return contractList
    },
    loadData() {
      var contractIds = []

      this.contracts.map(contract => {
        if (contract.contractId){
          contractIds.push(contract.contractId)
        }
        if (contract.isMasterContract) {
          this.masterContract = contract
        }
      })

      return this.loadContractInfos(contractIds)
        .then(this.loadReleasesInfo)
    },
    loadReleasesInfo(contracts) {
      const releaseIds = contracts.map(c => c.partyOne).join(',')
      return this.$services.ReleaseService.get(`list?releaseIds=${releaseIds}`)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            return { contracts, releases: res.data }
          }else {
            return { contracts, releases: [] }
          }
        })
    },
    loadContractInfos(contractIds) {
      return this.$services.contractRecords.get({
        params: {
          contractIds: contractIds.filter(id=>id).join(',')
        }
      }).then(res => res.getData())
    },
    showContractDetailHandler(contract) {
      if (!contract || !contract.contractId) {
        // this.$message.warning('未创建合同')
        return
      }
      this.currentContract = contract
    },
    fireContractsChange(){
      var contracts = this.contractList
      if (this.masterContract.contractId) {
        contracts = contracts.concat(this.masterContract)
      }

      this.$emit('contracts-change', contracts)
    },
    updateContractHandler(contract) {
      Object.assign(this.currentContract, contract)
      this.fireContractsChange()
    }
  }
}
