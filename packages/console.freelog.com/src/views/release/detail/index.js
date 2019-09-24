import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import RichEditor from '@/components/RichEditor/index.vue'
import SchemeManage from '../scheme/index.vue'
import ReleaseDependItem from '../scheme/depend-item.vue'
import signPolicyList from './sign-policy-list.vue'
import { versionDescendingOrder } from '@/lib/utils.js'

export default {
  name: "release-detail",
  components: { RichEditor, SchemeManage, ReleaseDependItem, signPolicyList },
  data() {
    return {
      releaseId: this.$route.params.releaseId,
      activeReleaseVersion: this.$route.query.version,
      isOwnRelease: false,
      isOnline: true,
      isUsable: true,
      isShowContentLoading: false,
      isCollectedRelease: false,
      release: null,
      selectedRelease: null,
      baseUpcastReleasesList: [],
      releasesTreeData: [],
      contractsMap: {},
      nodeContractsMap: {},
      nodeContracts: [],
      checkedNodeList: [],
      checkedNodeId: '',
      rSubordinateNodesIds: [],
      upcastDepReleasesMap: null,
      checkedLabelMap: {},
      resourceDetail: {
        resourceInfo: {
          description: ''
        }
      },
      comparePolices: [
        { activeIndex: 0 },
        { activeIndex: 1 },
      ],
      compareDialogVisible: false,
      signDialogVisible: false,
    }
  },
  computed: Object.assign({
    projection() {
      return ["releaseId", "resourceType", "releaseName", "latestVersion", "baseUpcastReleases", "policies", "updateDate","status"].join(',')
    },
    releaseMap() {
      const map = {}
      map[this.release.releaseId] = this.release
      this.baseUpcastReleasesList.forEach(r => {
        map[r.releaseId] = r
      })
      return map
    },
    isOwnRelease() {
      return true
    },
    nodeMap() {
      const map = {}
      for(let i = 0; i < this.nodes.length; i++) {
        const { nodeId, nodeName } = this.nodes[i]
        map[nodeId] = nodeName
      }
      return map
    },
  }, mapGetters({
    nodes: 'nodes',
    session: 'session'
  })),
  watch: {
    activeReleaseVersion(newV, oldV) {
      if(oldV !== '') {
        this.$router.replace(`/release/detail/${this.release.releaseId}?version=${newV}`)
        this.isShowContentLoading = true
        this.fetchResourceDetail()
      }
    },
    checkedNodeId() {
      this.fetchContracts(this.checkedNodeId)
        .then(contracts => {
          this.nodeContracts = contracts
          contracts.forEach(c => {
            this.contractsMap[c.contractId] = c
          })
        })
    },
  },
  created() {
    this.isShowContentLoading = true
    this.fetchReleaseDetail()
    this.fetchReleaseSubordinateNodes()
    this.getColleactedStatus()
  },
  methods: {
    // 获取发行详情
    fetchReleaseDetail() {
      this.$services.ReleaseService.get(this.releaseId)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.release = this.selectedRelease = res.data
            this.release.selectedPolicies = []
            this.isOnline = this.release.status === 1

            this.formatReleaseData()
            this.fetchResourceDetail()
            this.fetchUpcastDepReleases()
            if(this.session && this.session.user) {
              this.isOwnRelease = this.release.userId === this.session.user.userId
            }
          }
          this.isShowContentLoading = false
        }).catch(e => {
          this.$error.showErrorMessage(e)
          this.isShowContentLoading = false
        })
    },
    // 获取资源详情
    fetchResourceDetail() {
      const rVersions = this.release.resourceVersions
      var resourceId = ''
      for(let i = 0; i < rVersions.length; i++) {
        if(rVersions[i].version === this.activeReleaseVersion) {
          resourceId = rVersions[i].resourceId
          break
        }
      }
      this.$services.ResourceService.get(resourceId)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.resourceDetail.resourceInfo = res.data
          }
          this.isShowContentLoading = false
        })
        .catch(e => {
          this.isShowContentLoading = false
        })
    },
    // 获取发行与节点的签约数据
    fetchContracts(nodeId) {
      if(this.nodeContractsMap[nodeId]) {
        return Promise.resolve(this.nodeContractsMap[nodeId])
      }
      return this.$services.ContractService.get('list', {
        params: {
          contractType: 2,
          targetIds: this.releaseId,
          partyOne: this.releaseId,
          partyTwo: nodeId
        }
      })
      .then(resp => resp.data)
      .then(res => {
        if(res.errcode === 0) {
          this.nodeContractsMap[nodeId] = res.data
          return Promise.resolve(res.data)
        }else {
          return Promise.reject(res.msg)
        }
      })
      .catch(e => {
        this.$error.showErrorMessage(e)
      })
    },
    fetchReleases(ids) {
      return this.$services.ReleaseService.get(`list?releaseIds=${ids}&projection=${this.projection}`)
        .then(res => res.data)
    },
    // 获取 依赖发行的上抛发行详情
    fetchUpcastDepReleases() {
      const bUpcastReleases = this.release.baseUpcastReleases
      if(bUpcastReleases.length) {
        const ids = bUpcastReleases.map(r => r.releaseId).join(',')
        this.fetchReleases(ids)
          .then(res => {
            if(res.errcode === 0) {
              const arr = res.data || []
              this.upcastDepReleasesMap = {}
              for(let i = 0; i < arr.length; i++) {
                this.isUsable = arr[i].status === 1 && this.isUsable
                let releaseId = arr[i].releaseId
                arr[i].policies = arr[i].policies.map(p => {
                  p.checkedLabel = `${arr[i].releaseId}-${p.policyId}`
                  this.checkedLabelMap[p.checkedLabel] = { releaseName: arr[i].releaseName, policyName: p.policyName }
                  return p
                })
                arr[i].selectedPolicies = []
                this.upcastDepReleasesMap[releaseId] = arr[i]
              }
              this.baseUpcastReleasesList = arr
            }
          })
          .catch(e => this.isLoading = false)
      }
    },
    // 查询当前发行已签约生成presentables列表，从而获知发行已和哪些节点签约
    fetchReleaseSubordinateNodes() {
      this.$services.PresentablesService.get(`list`, {
        params: {
          releaseIds: this.releaseId,
          userId: this.session.user.userId,
          projection: 'nodeId'
        }
      })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.rSubordinateNodesIds = res.data.map(n => n.nodeId)
          }
        })
    },
    // 获取 收藏状态
    getColleactedStatus() {
      this.$services.collections.get(`isCollection?releaseIds=${this.releaseId}`)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0 && res.data && res.data.length > 0) {
            this.isCollectedRelease = res.data[0].isCollection
          }else {
            this.isCollectedRelease = false
          }
        })
    },
    // 重新处理发行详情数据
    formatReleaseData() {
      this.release.policies = this.release.policies.filter(p => p.status === 1).map(p => {
        p.checkedLabel = `${this.release.releaseId}-${p.policyId}`
        this.checkedLabelMap[p.checkedLabel] = { releaseName: this.release.releaseName, policyName: p.policyName }
        return p
      })
      this.release.resourceVersions = this.release.resourceVersions.sort(versionDescendingOrder).map(i => {
        i.createDate = format(i.createDate, 'YYYY-MM-DD')
        return i
      })
    },
    // 处理 收藏
    collectReleaseHandler() {
      if(!this.isCollectedRelease) {
        this.$services.collections.post({ releaseId: this.releaseId })
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.isCollectedRelease = true
            }
          })
      }else {
        this.$services.collections.delete(this.releaseId)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.isCollectedRelease = false
            }
          })
      }
    }, 
    // 切换“选中的发行”
    exchangeSelectedRelease(release) {
      this.selectedRelease = release
    },
    exchangeComparePolicy(item, index) {
      item.activeIndex = index
    },
    showSignBox() {
      if(!this.isUsable) return 

      var message = ''
      if(this.checkedNodeId === '') {
        message = '请先选择签约的节点'
      }else {
        var tmpArr = []
        if(this.release.selectedPolicies.length === 0) {
          tmpArr.push(this.release.releaseName)
        }
        this.baseUpcastReleasesList.forEach(r => {
          if(r.selectedPolicies.length === 0) {
            tmpArr.push(r.releaseName)
          }
        })
        if(tmpArr.length > 0) {
          message = `发行“${tmpArr.join(',')}”未选择策略！`
        }
      }
      
      if(message === '') {
        this.signDialogVisible = true
      }else {
        this.$message({ type: 'warning', message })
      }
    },
    // 获取授权：即创建presentable
    authSign() {

      const nodeId = this.checkedNodeId
      const self = this
      this.$services.PresentablesService.post({
        nodeId,
        releaseId: this.releaseId,
        presentableName: this.release.releaseName,
        version: this.activeReleaseVersion,
        resolveReleases: this.getRosolveReleases(),
      })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            const { nodeId, presentableId } = res.data
            this.rSubordinateNodesIds.push(nodeId)
            this.signDialogVisible = false
            this.$message({ type: 'success', message: '授权签约成功；即将跳转至节点发行管理页！', duration: 500, onClose() {
              self.$router.push(`/node/manager-release/${presentableId}`)
            }})

          }else {
            this.$error.showErrorMessage(res.msg)
          }
        })
        .catch(this.$error.showErrorMessage)
    },
    // 签约数据：已选择发行以及其上抛发行的策略
    getRosolveReleases() {
      const tmpMap = {}
      var targetArr = []
      targetArr = [ ...targetArr, ...resolveSelectedPolicies(this.release) ]
      this.baseUpcastReleasesList.forEach(release => {
        targetArr = [ ...targetArr, ...resolveSelectedPolicies(release) ]
      })
      return targetArr

      function resolveSelectedPolicies(release) {
        const targetArr = []
        release.selectedPolicies.forEach(p => {
          const { policyId } = p
          const { releaseId } = release
          if(tmpMap[releaseId]) {
            tmpMap[releaseId].contracts.push({ policyId })
          }else {
            const rItem = { releaseId, contracts:[{ policyId }]}
            tmpMap[releaseId] = rItem
            targetArr.push(rItem)
          }
        })
        return targetArr
      }
    },
    
  }
}
