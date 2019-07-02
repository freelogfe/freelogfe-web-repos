import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import RichEditor from '@/components/RichEditor/index.vue'
import { versionDescendingOrder } from '@/lib/utils.js'

export default {
  name: "release-detail",
  components: { RichEditor },
  data() {
    return {
      releaseId: this.$route.params.releaseId,
      activeReleaseVersion: this.$route.query.version,
      isShowContentLoading: false,
      isCollectedRelease: false,
      release: null,
      activePolicy: null,
      selectedRPolicyIdsList: [],
      selectedUpcastRPolicyIdsList: [],
      baseUpcastReleasesList: [],
      checkedNodeList: [],
      // selectedPolicies: [],
      upcastDepReleasesMap: null,
      checkedLabelMap: {},
      resourceDetail: {
        resourceInfo: {
          description: ''
        }
      },
      selectedPolicyId: '',
      comparePolices: [
        { activeIndex: 0 },
        { activeIndex: 1 },
      ],
      compareDialogVisible: false,
      signDialogVisible: false,
      rSubordinateNodesIds: []

    }
  },
  computed: Object.assign({
    projection() {
      return ["releaseId", "resourceType", "releaseName", "latestVersion", "baseUpcastReleases", "policies", "updateDate"].join(',')
    },
    selectedPolicies() {
      var targArr = [], tmpArr = [...this.selectedRPolicyIdsList, ...this.selectedUpcastRPolicyIdsList]
      tmpArr.forEach(item => {
        const [ releaseId, policyId ] = item.split('-')
        const { releaseName, policyName } = this.checkedLabelMap[`${releaseId}-${policyId}`]
        targArr.push({ releaseId, releaseName, policyId, policyName })
      })
      return targArr
    },
    releaseMap() {
      const map = {}
      map[this.release.releaseId] = this.release
      this.baseUpcastReleasesList.forEach(r => {
        map[r.releaseId] = r
      })
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
    selectedUpcastRPolicyIdsList() {
      var tmpIds = this.selectedPolicies.map(i => i.releaseId)
      this.baseUpcastReleasesList = this.baseUpcastReleasesList.map(r => {
        r.isSelectedPolicy = tmpIds.indexOf(r.releaseId) !== -1
        return r
      })
    },
  },
  methods: {
    fetchReleaseDetail() {
      this.$services.ReleaseService.get(this.releaseId)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.release = res.data

            this.formatReleaseData()
            this.fetchResourceDetail()
            this.fetchUpcastDepReleases()
          }
          this.isShowContentLoading = false
        }).catch(e => {
          this.$error.showErrorMessage(e)
          this.isShowContentLoading = false
        })
    },
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
    fetchReleases(ids) {
      return this.$services.ReleaseService.get(`list?releaseIds=${ids}&projection=${this.projection}`)
        .then(res => res.data)
    },
    // 获取 依赖发行的上抛发行
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
                let releaseId = arr[i].releaseId
                arr[i].policies = arr[i].policies.map(p => {
                  p.checkedLabel = `${arr[i].releaseId}-${p.policyId}`
                  this.checkedLabelMap[p.checkedLabel] = { releaseName: arr[i].releaseName, policyName: p.policyName }
                  return p
                })
                this.upcastDepReleasesMap[releaseId] = arr[i]
              }
              this.baseUpcastReleasesList = arr
            }
          })
          .catch(e => this.isLoading = false)
      }

    },
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
    formatReleaseData() {
      this.release.policies = this.release.policies.filter(p => p.status === 1).map(p => {
        p.checkedLabel = `${this.release.releaseId}-${p.policyId}`
        this.checkedLabelMap[p.checkedLabel] = { releaseName: this.release.releaseName, policyName: p.policyName }
        return p
      })
      this.activePolicy = this.release.policies[0]
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
    exchangeActivePolicy(p) {
      if(p.policyId !== this.activePolicy.policyId) {
        this.activePolicy = p
      }
    },
    exchangeComparePolicy(item, index) {
      item.activeIndex = index
    },
    showPolicyCompareBox() {
      this.compareDialogVisible = true
    },
    showSignBox() {
      var isSelectAllUpcastReleasePolicies = true,
        isSelectReleasePolicies = this.checkIsSelectReleasePolicy(this.selectedRPolicyIdsList, this.release)
      for(let i = 0; i <this.baseUpcastReleasesList.length; i++) {
        if(!this.checkIsSelectReleasePolicy(this.selectedUpcastRPolicyIdsList, this.baseUpcastReleasesList[i])) {
          isSelectAllUpcastReleasePolicies = false
          break
        }
      }

      if(isSelectAllUpcastReleasePolicies && isSelectReleasePolicies) {
        this.signDialogVisible = true
      }else {
        let message = ''
        if(!isSelectReleasePolicies && !isSelectAllUpcastReleasePolicies) {
          message = '发行未选择策略'
        }else  if(!isSelectReleasePolicies) {
          message = '当前发行未选择策略'
        }else if(!isSelectAllUpcastReleasePolicies) {
          message = '仍有上抛发行未选择策略'
        }
        this.$message({ type: 'warning', message })
      }

    },
    checkIsSelectReleasePolicy(sList, release) {
      var tmp = false
      const releaseId = release.releaseId
      for(let i = 0; i < release.policies.length; i++) {
        if(sList.indexOf(`${releaseId}-${release.policies[i].policyId}`) > -1) {
          tmp = true
          break
        }
      }
      return tmp
    },
    handlePolicyCommad(command) {
      const [ releaseId ] = command.split('-')
      var index = -1
      if(this.releaseId === releaseId) {
        index = this.selectedRPolicyIdsList.indexOf(command)
        if(index === -1) {
          this.selectedRPolicyIdsList.push(command)
        }else {

        }
      }else {
        if(this.selectedUpcastRPolicyIdsList.indexOf(command) === -1) {
          this.selectedUpcastRPolicyIdsList.push(command)
        }
      }
    }
    ,
    // 获取授权：即创建presentable
    authSign() {
      const targetNodes = this.checkedNodeList.filter(nodeId => this.rSubordinateNodesIds.indexOf(nodeId) === -1)
      targetNodes.forEach(nodeId => {
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
              this.rSubordinateNodesIds.push(res.data.nodeId)
              this.$message({ type: 'success', message: '授权签约成功！' })
            }else {
              this.$error.showErrorMessage(res.msg)
            }
          })
          .catch(this.$error.showErrorMessage)
      })
    },
    // 获取 发行以及其上抛的解决方式
    getRosolveReleases() {
      const tmpMap = {}
      const targetArr = []
      this.selectedPolicies.forEach(p => {
        const { releaseId, policyId } = p
        if(tmpMap[releaseId]) {
          tmpMap[releaseId].contracts.push({ policyId })
        }else {
          const rItem = { releaseId, contracts:[{ policyId }]}
          tmpMap[releaseId] = rItem
          targetArr.push(rItem)
        }
      })
      return targetArr
    },
  },
  created() {
    this.isShowContentLoading = true
    this.fetchReleaseDetail()
    this.fetchReleaseSubordinateNodes()
    this.getColleactedStatus()
  }
}
