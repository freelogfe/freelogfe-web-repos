
import {mapGetters} from 'vuex'
import i18n from '@/lib/i18n'
import SchemeSignDialog from '@/components/Authorization-scheme/scheme-sign-dialog.vue'
import SchemeSuspensionBall from '@/components/Authorization-scheme/scheme-suspension-ball.vue'
import SchemeDetail from './scheme-detail.vue'
import throttle from 'lodash/throttle'

export default {
  name: 'authorization-scheme-manage',
  components: {
    SchemeDetail, SchemeSignDialog, SchemeSuspensionBall
  },
  props: {
    authType: String,
    presentableInfo: Object,
    resourceInfo: Object,
    contracts: Array,
    bubbleResourcesMap: { // 不处理的上抛资源，作用于"资源编辑页面"
      type: Object,
      default: function () {
        return {}
      }
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    isScrollBar: {
      type: Boolean,
      default: true
    },
    isPreventExchangeSelection: {
      type: Boolean,
      default: false
    },
    isAbandon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allPartitionBoxW: 0,
      contentBoxTX: 0,
      contentBoxStyle: {},
      maxTX: 0,
      authSchemeBoxScrollLeft: 0,
      isShowLoading: false,
      isCanUpdateContract: false,
      isShowSuspensionSchemeList: false,
      isShowNavBar: false,
      currentOpenedResources: [],             // 当前页面已打开的资源
      resourceMap: {},
      selectedAuthSchemes: [],                 // 已选中的授权方案集合
      unResolveAuthResources: [],             // 不处理授权方案的资源集合
      actIndex: 0,
      isRegisterGlobalClickEvent: false,
      authSchemeIdentityAuthMap: {},
      throttleFn: null,
      isShowDialog: false,                    // 是否显示"签约提示"弹窗
    }
  },
  computed: {
    qiHostname() {
      return window.location.hostname.replace(/^console/g, 'qi')
    },
    resourceContractsMap() {
      var map = {}
      this.contracts.forEach(contract => {
        const {resourceId} = contract
        map[resourceId] = contract
      })
      return map
    },
    boxStyle() {
      if (this.authType === 'resource') {
        return {}
      }

      if (this.currentOpenedResources.length > 1) {
        let clientWidth = document.body.clientWidth || document.documentElement.clientWidth
        return {
          position: 'relative',
          left: (document.querySelector('#pane-scheme-manager').offsetWidth - clientWidth) / 2 + 'px',
          width: clientWidth + 'px',
          margin: 0,
          "padding": "0 35px",
          "box-sizing": "border-box",
        }
      } else {
        return {}
      }
    },
    redBarStyle() {
      var x = (this.authSchemeBoxScrollLeft / this.allPartitionBoxW).toFixed(4) * 150 + 'px'
      return {
        width: (window.innerWidth / this.allPartitionBoxW).toFixed(4) * 100 + '%',
        transform: `translateX(${x})`,
      }
    },
    ...mapGetters({
      session: 'session',
    }),
  },
  methods: {
    initPresentableAuthSchemes() {
      this.isShowLoading = true
      var resourceId = this.resourceInfo.resourceId

      var resourceIdSet = new Set(this.contracts.map(c => c.resourceId))
      resourceIdSet.add(resourceId)

      return this.getResourceSchemeDetail([...resourceIdSet].join(','))
        .then(() => {
          if (this.resourceMap[resourceId]) {
            this.currentOpenedResources = []
            this.currentOpenedResources.push(this.resourceMap[resourceId])
            this.refreshSelectedAuthSchemes()
          }
          this.isShowLoading = false
          return Promise.resolve()
        })
        .catch((e) => {
          this.isShowLoading = false
          this.$message.error(e.toString())
        })
    },
    reInitPresentableAuthSchemes(newContracts) {
      this.$emit('update:contracts', newContracts)
      this.updatePresentableScheme(newContracts)
      newContracts.forEach(c => {
        this.resolveAuthSchemeParams(this.resourceMap[c.resourceId], c)
      })

      switch (this.authType) {
        case 'presentable': {
          this.$router.push({
            path: `/node/${this.$route.params.nodeId}/presentable/${this.$route.params.presentableId}`,
            query: {tab: 'contract'}
          })
          break
        }
        case 'resource': {
          break
        }
        default: {
        }
      }
    },
    updatePresentableScheme(newContracts) {
      const tempOR = this.currentOpenedResources[0]
      if (tempOR) {
        const {authSchemeList, selectedAuthSchemeTabIndex, resourceId} = tempOR
        var contract = null

        for (let i = 0; i < newContracts.length; i++) {
          if (newContracts[i].resourceId === resourceId) {
            contract = newContracts[i]
            break
          }
        }
        this.$emit('update-selected-scheme', authSchemeList[selectedAuthSchemeTabIndex], contract)
      }

    },
    toggleResolveResource(resourceAuthScheme, resourceLevelIndex) {
      if (!this.checkIsCanExchangeSelection()) return
      resourceAuthScheme.isNoResolved = !resourceAuthScheme.isNoResolved

      const {activeAuthSchemeTabIndex, authSchemeList, isNoResolved} = resourceAuthScheme

      if (isNoResolved) {
        var bubbleResources = authSchemeList[activeAuthSchemeTabIndex].bubbleResources.map(item => {
          const {resourceId} = item
          if (!this.resourceMap[resourceId]) {
            item.selectedAuthSchemeTabIndex = -1
            return item
          } else {
            return this.resourceMap[resourceId]
          }
        })
        resourceAuthScheme.selectedAuthSchemeTabIndex = -1
        resourceAuthScheme.selectedPolicyIndex = -1
        resourceAuthScheme.isFinishSelectedAuthScheme = false
        authSchemeList[activeAuthSchemeTabIndex].selectedUpcastResourceIndex = -1
        this.cancelSomeURSchemeSelection(bubbleResources)
        this.currentOpenedResources = this.currentOpenedResources.slice(0, resourceLevelIndex + 1)
      }
      this.getAuthResolveState()
    },
    // 已经发布或已废弃的"授权方案"，阻止更改
    checkIsCanExchangeSelection() {
      if (this.isPreventExchangeSelection) {
        this.$message.warning(i18n.t('components.authScheme.checkthis.$messages[0]'))
        return false
      }
      if (this.isAbandon) {
        this.$message.warning(i18n.t('components.authScheme.checkthis.$messages[1]'))
        return false
      } else {
        return true
      }
    },
    // 取消当前资源 所有下级资源的授权方案选择
    cancelSomeURSchemeSelection(bubbleResources) {
      for (let i = 0; i < bubbleResources.length; i++) {
        const {resourceId} = bubbleResources[i]
        let targResource = this.resourceMap[resourceId]
        if (targResource) {
          const {selectedAuthSchemeTabIndex, authSchemeList} = targResource
          if (selectedAuthSchemeTabIndex !== -1) {
            const {bubbleResources = []} = authSchemeList[selectedAuthSchemeTabIndex]
            targResource.selectedAuthSchemeTabIndex = -1
            targResource.selectedPolicyIndex = -1
            targResource.isFinishSelectedAuthScheme = false
            this.cancelSomeURSchemeSelection(bubbleResources)
          }
        }
      }
    },
    // 点击"更新合约"或"生成合约"按钮
    signContract() {
      const arr = this.checkIsExistUnselectedScheme(this.currentOpenedResources[0])
      if (arr.length) {
        this.$message.error(i18n.t('components.authScheme.signContractError', {resource: arr.join('"、"')}))
        return
      }
      this.isShowDialog = true
    },
    // 检测是否能点击"更新合同"
    checkIsExistUnselectedScheme(openResource) {
      var arr = []
      const {resourceName, authSchemeList, selectedAuthSchemeTabIndex, activeAuthSchemeTabIndex} = openResource
      if (selectedAuthSchemeTabIndex === -1) {
        arr.push(resourceName)
      }

      const {bubbleResources = []} = authSchemeList[activeAuthSchemeTabIndex]
      for (let i = 0; i < bubbleResources.length; i++) {
        const {resourceId, resourceName} = bubbleResources[i]
        const tempAuthSchemeData = this.resourceMap[resourceId]
        if (tempAuthSchemeData) {
          arr = [...arr, ...this.checkIsExistUnselectedScheme(tempAuthSchemeData)]
        } else {
          arr.push(resourceName)
        }
      }
      return arr
    },
    afterSginContract(data) {
      var str = this.presentableInfo.contracts.length ? i18n.t('components.authScheme.update') : i18n.t('components.authScheme.generate')
      this.$message.success(i18n.t('components.authScheme.signSuccessMsg', {
          presentableName: this.presentableInfo.presentableName,
          msg: str
        }
      ))
      this.reInitPresentableAuthSchemes(data.contracts)
    },
    resolveUpdateDate(updateDate) {
      const date = new Date(updateDate)
      return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
    },
    refreshSelectedAuthSchemes() {
      this.selectedAuthSchemes = []
      this.unResolveAuthResources = []
      this.getSelectedAuthScheme(this.currentOpenedResources[0])
      this.$emit('update-resolved-auth-scheme', {
        resourceId: this.resourceInfo.resourceId,
        selectedAuthSchemes: this.selectedAuthSchemes,
        unResolveAuthResources: this.unResolveAuthResources
      })
      this.getAuthResolveState()
    },
    // 获取选中的"授权方案和策略"与"未处理的资源（即上抛资源）"的信息
    getSelectedAuthScheme(authSchemesData) {
      if (authSchemesData) {
        const {isNoResolved, authSchemeList, resourceName, resourceId, selectedAuthSchemeTabIndex, selectedPolicyIndex} = authSchemesData
        if (isNoResolved) {
          this.unResolveAuthResources.push({resourceName, resourceId})
          return
        }
        if (selectedAuthSchemeTabIndex !== -1) {
          const {authSchemeName, policy, bubbleResources, authSchemeId} = authSchemeList[selectedAuthSchemeTabIndex]
          let {policyName, segmentId, isHasSignHistory} = policy[selectedPolicyIndex]
          const contractId = this.getContractIdBySchemeInfo({resourceId, authSchemeId, segmentId})

          this.selectedAuthSchemes.push({
            resourceName, resourceId, authSchemeName, authSchemeId, policyName, segmentId, contractId, isHasSignHistory
          })
          bubbleResources.forEach(bResource => {
            const {resourceId} = bResource
            this.getSelectedAuthScheme(this.resourceMap[resourceId])
          })
        }
      }
    },
    getContractIdBySchemeInfo({resourceId, authSchemeId, segmentId}) {
      const contract = this.resourceContractsMap[resourceId]
      if (contract) {
        if (contract.targetId === authSchemeId && segmentId === contract.segmentId) {
          return contract.contractId
        }
      }
      return
    },
    // 获取"依赖"的处理状态： 1：完全处理，不包含上抛；0：不完全处理，包含上抛，-1：未处理
    getAuthResolveState() {
      var authResolveState = -1
      var cOResources = this.currentOpenedResources
      for (let i = 0; i < cOResources.length; i++) {
        const oR = cOResources[i]

        if (oR.isFinishSelectedAuthScheme) {
          authResolveState = 1
          break
        }
        if (oR.isNoResolved) {
          authResolveState = 0
          break
        }
        if (oR.selectedAuthSchemeTabIndex === -1) {
          authResolveState = -1
          break
        }
      }
      this.resourceInfo.authResolveState = authResolveState
      this.$emit('exchange-auth-resolve-state')
    },
    refreshCurrentOpenedResource(resourceLevelIndex) {
      var targArr = this.currentOpenedResources.slice(0, resourceLevelIndex + 1)
      var tempResource = this.currentOpenedResources[resourceLevelIndex]

      while (tempResource !== null) {
        const {activeAuthSchemeTabIndex, authSchemeList} = tempResource

        const {bubbleResources, selectedUpcastResourceIndex = -1} = authSchemeList[activeAuthSchemeTabIndex]

        if (selectedUpcastResourceIndex === -1) {
          tempResource = null
        } else {
          const {resourceId} = bubbleResources[selectedUpcastResourceIndex]

          if (this.resourceMap[resourceId]) {
            targArr.push(this.resourceMap[resourceId])
            tempResource = this.resourceMap[resourceId]
          } else {
            tempResource = null
          }
        }
      }
      this.currentOpenedResources = targArr
    },
    // 显示 上抛资源 的授权方案
    showUpcastResourceScheme(upcastResource, resourceLevelIndex) {
      const {resourceId} = upcastResource

      if (!this.resourceMap[resourceId] || this.resourceMap[resourceId].authSchemeList.length === 0) {
        this.getResourceSchemeDetail(resourceId, resourceLevelIndex)
          .then(() => {
            this.refreshCurrentOpenedResource(resourceLevelIndex)
          })
      } else {
        this.refreshCurrentOpenedResource(resourceLevelIndex)
      }
    },
    // 获取资源的授权方案详情
    getResourceSchemeDetail(resourceIds) {
      if (resourceIds !== '') {
        return Promise.all([
          this.getResourceDetailList(resourceIds),
          this.getResourceAuthSchemesList(resourceIds)
        ])
          .then(([detailListRes, authSchemeListRes]) => {

            if (detailListRes.errcode === 0) {
              detailListRes.data.forEach(item => {
                const {resourceId, resourceName, resourceType, userName, updateDate} = item
                if (authSchemeListRes[resourceId]) {
                  this.resolveAuthSchemeListRes(authSchemeListRes[resourceId], resourceId)

                  // var resourceDate = this.resolveUpdateDate(updateDate)
                  Object.assign(this.resourceMap[resourceId], {
                    resourceName, resourceType, userName, updateDate
                  })
                }
              })
              this.getResourcesContractSignState(detailListRes, authSchemeListRes)
            }
            return Promise.resolve()
          })
      } else {
        return Promise.reject()
      }

    },
    // 获取资源详情
    getResourceDetail(resourceId) {
      return this.$axios.get(`//${this.qiHostname}/v1/resources/${resourceId}`)
        .then(res => res.data)
    },
    // 获取资源详情列表
    getResourceDetailList(resourceIds) {
      return this.$axios.get(`//${this.qiHostname}/v1/resources/list?resourceIds=${resourceIds}`)
        .then(res => res.data)
    },
    // 获取资源授权方法
    getResourceAuthSchemesList(resourceIds) {
      return this.$axios.get(`//${this.qiHostname}/v1/resources/authSchemes`, {
        params: {
          policyStatus: 2,
          resourceIds
        }
      }).then(res => res.data)
        .then(res => {
          var map = {}
          if (res.errcode === 0) {
            res.data.forEach(item => {
              const {resourceId, status} = item
              if (status === 1) {
                map[resourceId] = map[resourceId] || []
                map[resourceId].push(item)
              }
            })
          } else {
            this.$message.error(res.msg)
          }
          return Promise.resolve(map)
        })
    },
    resolveAuthSchemeListRes(authSchemeList, resourceId) {
      const contractObj = this.resourceContractsMap[resourceId]
      var isNoResolved = false
      if (this.authType === 'resource') {
        isNoResolved = !!this.bubbleResourcesMap[resourceId]
      }

      this.resourceMap[resourceId] = this.resourceMap[resourceId] || {
        resourceId,
        authSchemeList,
        selectedAuthSchemeTabIndex: -1,
        activeAuthSchemeTabIndex: 0,
        selectedPolicyIndex: -1,
        isFinishSelectedAuthScheme: !!contractObj,
        isNoResolved,
      }

      this.resolveAuthSchemeParams(this.resourceMap[resourceId], contractObj)

      var authSchemeIds = authSchemeList.map(item => item.authSchemeId).join(',')
      this.getAuthSchemeIdentityAuth(authSchemeIds)
    },
    // 根据合同确定"授权方案与授权策略"的选中序号
    resolveAuthSchemeParams(tempResource, contractObj) {
      const {authSchemeList} = tempResource

      if (contractObj) {
        let targetId = contractObj.targetId || contractObj.authSchemeId
        let segmentId = contractObj.segmentId || contractObj.policySegmentId

        for (let i = 0; i < authSchemeList.length; i++) {
          if (authSchemeList[i].authSchemeId === targetId) {
            tempResource.activeAuthSchemeTabIndex = tempResource.selectedAuthSchemeTabIndex = i

            const {policy} = authSchemeList[i]
            for (let j = 0; j < policy.length; j++) {
              if (policy[j].segmentId === segmentId) {
                tempResource.selectedPolicyIndex = j
                policy[j].isHasSignHistory = true
              }
            }
            break
          }
        }
      }
    },
    // 获取授权点的策略段身份认证结果
    getAuthSchemeIdentityAuth(authSchemeIds) {
      if (authSchemeIds.length === 0) return
      var url = `//${this.qiHostname}/v1/auths/authSchemeIdentityAuth?authSchemeIds=${authSchemeIds}`
      if (this.authType === 'presentable') {
        var nodeId = this.presentableInfo.nodeId
        url = url + `&nodeId=${nodeId}`
      }
      return this.$axios.get(url)
        .then(res => res.data)
        .then(res => {
          if (res.errcode === 0) {
            res.data.forEach(item => {
              const {authSchemeId, policy} = item
              this.authSchemeIdentityAuthMap[authSchemeId] = this.authSchemeIdentityAuthMap[authSchemeId] || {}
              const tempMap = this.authSchemeIdentityAuthMap[authSchemeId]
              policy.forEach(p => {
                tempMap[p.segmentId] = p
              })
            })
            this.authSchemeIdentityAuthMap = Object.assign({}, this.authSchemeIdentityAuthMap)
          } else {
            this.$message.error(res.msg || '')
          }
        })
    },
    getResourcesContractSignState(detailListRes, authSchemeListRes) {
      if (this.authType === 'presentable') {
        if (detailListRes.data) {
          const resourceIDs = detailListRes.data.map(item => item.resourceId)
          const ids = resourceIDs.join(',')
          let arr = []
          resourceIDs.forEach(id => {
            const tempAuthSchemeIdArr = authSchemeListRes[id]
            if (tempAuthSchemeIdArr) {
              tempAuthSchemeIdArr.forEach(({authSchemeId}) => arr.push(authSchemeId))
            }
          })
          let targetIds = arr.join(',')
          let partyTwo = this.presentableInfo.nodeId

          return this.$axios.get(`/v1/contracts/contractRecords?resourceIds=${ids}&targetIds=${targetIds}&partyTwo=${partyTwo}`)
            .then(res => res.data)
            .then(res => {
              if (res.errcode === 0) {
                const contracts = res.data
                for (let i = 0; i < contracts.length; i++) {
                  const {resourceId, segmentId, targetId} = contracts[i]
                  const tempResource = this.resourceMap[resourceId]
                  tempResource.authSchemeList.forEach(item => {
                    if (item.authSchemeId === targetId) {
                      item.policy.forEach(p => {
                        if (p.segmentId === segmentId) {
                          p.isHasSignHistory = true
                        }
                      })
                    }
                  })
                }
              }
            })
        }
      }
    },
    authSchemeBoxScroll(e) {
      this.authSchemeBoxScrollLeft = e.target.scrollLeft
    },
    contentScroll(type) {
      const $partitionBox = document.querySelector('.scheme-partition')
      var contentBoxTX = this.contentBoxTX
      const maxTX = this.maxTX

      switch (type) {
        case 'left': {
          contentBoxTX = contentBoxTX + $partitionBox.offsetWidth
          contentBoxTX = contentBoxTX > maxTX ? maxTX : contentBoxTX
          break
        }
        case 'right': {
          contentBoxTX = contentBoxTX - $partitionBox.offsetWidth
          contentBoxTX = contentBoxTX < 0 ? 0 : contentBoxTX
          break
        }
      }

      this.contentBoxTX = contentBoxTX
      this.contentBoxStyle = {"transform": `translateX(-${contentBoxTX}px)`}
    },
  },
  watch: {
    currentOpenedResources() {
      setTimeout(() => {
        const $partitionBox = document.querySelector('.scheme-partition')
        const $wrapperBox = document.querySelector('.dependencies-resolve-box')

        if ($partitionBox) {
          var allPartitionBoxW = $partitionBox.offsetWidth * this.currentOpenedResources.length
          this.allPartitionBoxW = allPartitionBoxW
          switch (this.authType) {
            case 'presentable': {
              this.maxTX = this.allPartitionBoxW - window.innerWidth + 70
              this.isShowNavBar = window.innerWidth < this.allPartitionBoxW
              break
            }
            case 'resource': {
              this.maxTX = this.allPartitionBoxW - $wrapperBox.offsetWidth + 60
              this.isShowNavBar = $wrapperBox.offsetWidth < this.allPartitionBoxW
              break
            }
          }
        }
      })
    },
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideSuspensionSchemeList)
    document.removeEventListener('scroll', this.throttleFn)
  },
  mounted() {
    this.initPresentableAuthSchemes()
    // if(this.isScrollBar) {
    //   this.throttleFn = throttle(this.authSchemeBoxScroll, 17).bind(this)
    //   const $box = document.querySelector('.authorization-scheme-box')
    //   if($box) {
    //     $box.addEventListener('scroll', this.throttleFn, false)
    //   }
    // }
  }
}
