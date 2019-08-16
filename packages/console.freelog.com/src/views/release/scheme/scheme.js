
import { beautifyPolicy, } from '@freelog/freelog-policy-lang'
import { ContractDetail } from '@freelog/freelog-ui-contract'
import { CONTRACT_STATUS_TIPS } from '@/config/contract.js'
import ReleaseDependItem from './depend-item.vue'
import SchemeFloatBall from '@/components/Authorization-scheme/scheme-float-ball.vue'

export default {
  name: 'scheme-manage',
  components: {
    ReleaseDependItem, SchemeFloatBall, ContractDetail
  },
  props:  {
    type: {
      type: String,
      default: 'create'
    },
    release: Object,
    releasesTreeData: Array,
    depReleasesList: {
      type: Array,
      default: function (){ return [] }
    },
    depReleasesDetailList: {
      type: Array,
      default: function (){ return [] }
    },
    baseUpcastReleases: {
      type: Array,
      default: function (){ return [] }
    },
    contracts: {
      type: Array,
      default: function (){ return [] }
    },
  },
  data() {
    return {
      isLoading: false,
      activeSelectedIndex: 0,
      isSelectedReleaesUpcast: false,
      releasesMap: {},
      releaseIdNameMap: {},
      upcastDepReleasesMap: null,
      contractsMap: null,
      targetReleases: [],
      tmpSelectedPolicies: [],
      tmpSignedPolicies: [],
      tmpNoSignedPolicies: [],
      selectedAuthSchemes: [],
      contractIds: [],
      selectedRelease: {},
      releasesContractRecordsMap: {},
      selectedReleaseContractRecords: [],
      releaseScheme: null
    }
  },
  computed: {
    baseUpcastReleasesIDs() {
      return this.baseUpcastReleases.map(i => i.releaseId)
    },
    projection() {
      return ["releaseId", "resourceType", "releaseName", "latestVersion", "baseUpcastReleases", "policies", "updateDate"].join(',')
    },
  },
  watch: {
    releaseScheme() {
      this.getTargetReleases()
    },
    depReleasesDetailList() {
      this.getTargetReleases()
    },
    depReleasesList(newV, oldV) {
      this.initData()
    },
    contracts() {
      const contractsMap = this.contractsMap || {}
      this.contracts.forEach(c => {
        c.partyOne = this.releaseIdNameMap[c.partyOne] || c.partyOne
        c.partyTwo = this.releaseIdNameMap[c.partyTwo] || c.partyTwo
        c.statusTip = CONTRACT_STATUS_TIPS[c.status]
        contractsMap[c.contractId] = c
      })
      this.contractsMap = contractsMap
      this.getTargetReleases()
    }
  },
  methods: {
    initData() {
      if(this.depReleasesList.length > 0) {
        this.isLoading = true
        if(this.release && this.release.releaseId) {
          this.releaseIdNameMap[this.release.releaseId] = this.release.releaseName
        }
        
        this.fetchDepReleases()
        this.fetchReleaseScheme()
      }
    },
    // 获取 依赖发行
    fetchDepReleases() {
      const depReleaseIDs = this.depReleasesList.map(dep => dep.releaseId).join(',')
      this.fetchReleases(depReleaseIDs)
        .then(res => {
          if(res.errcode === 0) {
            this.$emit('update:depReleasesDetailList', res.data || [])
            this.selectedRelease = res.data[0] || {}
            let tmpArr = []
            res.data.forEach(release => {
              this.releasesMap[release.releaseId] = release
              this.releaseIdNameMap[release.releaseId] = release.releaseName
              if(release.baseUpcastReleases) {
                tmpArr = [ ...tmpArr, ...release.baseUpcastReleases.map(i => i.releaseId) ]
              }
            })

            if(tmpArr.length > 0) {
              this.fetchUpcastDepReleases(tmpArr.join(','))
            }else {
              this.upcastDepReleasesMap = {}
            }
          }
        })
        .catch(e => {
          console.log('e --', e)
          this.isLoading = false
        })
    },
    fetchReleases(ids) {
      return this.$services.ReleaseService.get(`list?releaseIds=${ids}&projection=${this.projection}`)
        .then(res => res.data)
    },
    // 获取 依赖发行的上抛发行
    fetchUpcastDepReleases(upcastDepReleasesIds) {
      this.fetchReleases(upcastDepReleasesIds)
        .then(res => {
          if(res.errcode === 0) {
            const arr = res.data || []
            this.upcastDepReleasesMap = {}
            for(let i = 0; i < arr.length; i++) {
              let releaseId = arr[i].releaseId
              this.upcastDepReleasesMap[releaseId] = arr[i]
              this.releaseIdNameMap[releaseId] = arr[i].releaseName
              if(!this.releasesMap[releaseId]) {
                this.releasesMap[releaseId] = arr[i]
              }
            }
            this.getTargetReleases()
          }
        })
        .catch(e => this.isLoading = false)
    },
    // 获取 发行方案
    fetchReleaseScheme() {
      if(!this.release) return
      var { releaseId, latestVersion: { version } } = this.release
      version = this.release.selectedVersion || version
      this.$services.ReleaseService.get(`${releaseId}/versions/${version}`)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.releaseScheme = res.data
            this.fetchContractsDetail()
          }
        })
        .catch(e => this.$error.showErrorMessage('授权方案获取失败！'))
    },
    fetchContractsDetail() {
      const { resolveReleases } = this.releaseScheme 
      const targetIds = resolveReleases.map(r => r.releaseId).join(',')
      var schemeContractIds = new Set([])
      for(let i = 0; i < resolveReleases.length; i++) {
        const { contracts } = resolveReleases[i]
        contracts.forEach(c => {
          if(c.contractId) {
            schemeContractIds.add(c.contractId)
          }
        })
      }

      if(targetIds.length > 0) {
        this.$services.ContractRecords.get({
          params: {
            targetIds,
            partyTwo: this.release.releaseId
          }
        })
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              const contracts = res.data
              contracts.forEach(c => {
                c.isEnbledContract = schemeContractIds.has(c.contractId)
              })
              this.$emit('update:contracts', contracts)
            }
          })
      }else {
        this.$emit('update:contracts', [])
      }
    },
    getTargetReleases() {
      this.resolveReleaseScheme()
      const dReleasesList = this.depReleasesDetailList.filter(item => item.policies)

      for(let i = 0; i < dReleasesList.length; i++) {
        let rItem = this.depReleasesDetailList[i]
        rItem = this.formatRelease(rItem)
        rItem.baseUpcastReleases = rItem.baseUpcastReleases.map(item => {
          const tmpRelease = this.releasesMap[item.releaseId]
          if(tmpRelease) {
            item = this.formatRelease(tmpRelease)
          }
          return item
        })
      }
      this.resetData()
      this.isLoading = false

    },
    resolveReleaseScheme() {
      if(!this.releaseScheme ) return

      const { resolveReleases } = this.releaseScheme

      for(let i = 0; i < resolveReleases.length; i++) {
        const { contracts, releaseId } = resolveReleases[i]
        const release = this.releasesMap[releaseId]

        const pIdsMap = {}
        contracts.forEach(c => pIdsMap[c.policyId] = c.contractId)
        this.contracts.forEach(c => {
          const { contractId, targetId } = c
          if(targetId === releaseId) {
            pIdsMap[c.policyId] = contractId
          }
        })

        if(release) {
          release.contracts = contracts
          release.resolveStatus = 'resolved'
          release.selectedPolicies = []
          release.policies = release.policies.map(p => {
            const contractId = pIdsMap[p.policyId]
            if(typeof contractId !== 'undefined') {
              p.isSelected = true
              p.isEnbledContract = this.contractsMap && this.contractsMap[contractId].isEnbledContract
              p.contractId = contractId
              p.hasContract = 1
              release.selectedPolicies.push(p)
            }else {
              p.hasContract = -1
            }
            return p
          })
        }
      }
    },
    formatRelease(release) {

      if(this.baseUpcastReleasesIDs.indexOf(release.releaseId) !== -1) {
        release.isUpcasted = true
      }else {
        release.isUpcasted = false
      }
      this.initReleaseResolveStatus(release)
      release.selectedPolicies = release.selectedPolicies || []
      release.policies = release.policies.map(p => {
        p.isSelected = typeof p.isSelected === 'undefined' ? false : p.isSelected
        return p
      })
      return release
    },
    // 初始发行方案解决状态（已解决、未解决、上抛）
    initReleaseResolveStatus(release) {
      switch (this.type) {
        case 'create': {
          release.resolveStatus = 'no-resolve'
          break
        }
        case 'add': {}
        case 'edit': {
          release.resolveStatus = release.resolveStatus ? release.resolveStatus : release.isUpcasted ? 'upcast' : 'no-resolve'
          break
        }
        default: {}
      }
    },
    resetData() {
      this.tmpSelectedPolicies = this.selectedRelease.policies
      if(this.tmpSelectedPolicies && this.tmpSelectedPolicies.length) {
        this.tmpSignedPolicies = this.selectedRelease.policies.filter(p => p.hasContract === 1)
        this.tmpNoSignedPolicies = this.selectedRelease.policies.filter(p => p.hasContract == null || p.hasContract === -1)
      }
        
      this.isSelectedReleaesUpcast = this.selectedRelease.isUpcasted
      this.selectedRelease.resolveStatus = this.getReleaseResolveStatus()
      this.resolveSelectedAuthSchemes()
    },
    // 获取 发行方案解决状态（已解决、未解决、上抛）
    getReleaseResolveStatus() {
      if(this.selectedRelease.isUpcasted) {
        return 'upcast'
      }else {
        if(this.selectedRelease.selectedPolicies && this.selectedRelease.selectedPolicies.length > 0) {
          return 'resolved'
        }else {
          return 'no-resolve'
        }
      }
    },
    resolveSelectedAuthSchemes() {
      const arr = []
      const releases = this.depReleasesDetailList
      const tmp = {}
      for(let i = 0; i < releases.length; i++) {
        let item = releases[i]
        if(item.resolveStatus === 'resolved') {
          if(tmp[item.releaseId] !== 1) {
            tmp[item.releaseId] = 1
            arr.push(item)
          }
        }
        if(item.baseUpcastReleases) {
          item.baseUpcastReleases.forEach(brItem => {
            if(brItem.resolveStatus === 'resolved') {
              if(tmp[brItem.releaseId] !== 1) {
                tmp[brItem.releaseId] = 1
                arr.push(brItem)
              }
            }
          })
        }
      }
      this.selectedAuthSchemes = arr
      this.$emit('update-resolved-releases', this.selectedAuthSchemes)
    },
    updateContractAfterEvent(){},
    fmtPolicyTextList(p) {
      return beautifyPolicy(p.policyText)
    },
    // 上抛
    upcastHandler() {
      this.selectedRelease.isUpcasted = !this.selectedRelease.isUpcasted
      this.resetData()
      if(this.selectedRelease.isUpcasted) {
        this.toggleBaseUpcastReleases(this.selectedRelease, 'add')
      }else {
        this.toggleBaseUpcastReleases(this.selectedRelease, 'delete')
      }
      this.$emit('update:baseUpcastReleases', this.baseUpcastReleases)
    },
    // 切换 发行
    exchangeSelectedRelease(release) {
      this.selectedRelease = release
      this.resetData()
    },
    // 启用或搁置 合同
    toggleEnabledContract(policy) {
      // console.log(JSON.parse(JSON.stringify(this.selectedRelease)))
      if(policy.isEnbledContract) {
        policy.isEnbledContract = false
        const policies = this.selectedRelease.policies
        const leng = policies.length
        let enbledContractCount = 0
        for(let i = 0; i < leng; i++) { 
          if(policies[i].isEnbledContract) {
            enbledContractCount += 1
          }
        }
        if(enbledContractCount === 0) {
          this.$message({ type: 'warning', message: '至少须启动一个合同！'})
          policy.isEnbledContract = true
          return
        }
      }else {
        policy.isEnbledContract = true
      }
      
      this.resetData()
      this.$emit('update-release-scheme', policy.isEnbledContract ? '合同启用成功！' : '合同搁置成功！')
    },
    // 策略 直接签约
    policySignImmediately(policy) {
      policy.isSigned = true
      this.resetData()
      this.$emit('policy-sign-immediately')
    },
    // 选择策略
    selectPolicy(policy, index) {
      if(this.type !== 'create') {
        if(policy.contractId && this.contractsMap && this.contractsMap[policy.contractId]) {
          this.$message({ type: 'warning', message: '已签约，不可更改！' })
          return
        }
      }

      policy.isSelected = !policy.isSelected
      this.tmpSelectedPolicies.splice(index, 1, policy)
      if(policy.isSelected) {
        this.togglePolicy(policy, 'add')
      }else {
        this.togglePolicy(policy, 'delete')
      }
      this.resetData()
    },
    togglePolicy(policy, type) {
      const arr = this.selectedRelease.selectedPolicies
      this.toggleArrayItem(type, arr, policy, (i1, i2) => i1.policyId === i2.policyId)
    },
    toggleArrayItem(type, arr, target, verify) {
      var index = -1
      for(let i = 0; i < arr.length; i++) {
        if(verify(target, arr[i])) {
          index = i
          break
        }
      }
      switch (type) {
        case 'add': {
          if(index === -1) {
            arr.push(target)
          }
          break
        }
        case 'delete': {
          if(index !== -1) {
            arr.splice(index, 1)
          }
        }
      }
    },
    toggleBaseUpcastReleases(release, type) {
      const arr = this.baseUpcastReleases
      this.toggleArrayItem(type, arr, release, (i1, i2) => i1.releaseId === i2.releaseId)
    },
  },
  created() {
    this.initData()
  }
}

 