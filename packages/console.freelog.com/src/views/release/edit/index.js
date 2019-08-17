import { format } from 'date-fns'
import ReleaseEditorLayout from './layout.vue'
import ReleaseEditorContract from '@/views/release/contract/index.vue'
import ResourceSearch from '@/views/resource/search/search.vue'
import LazyListView from '@/components/LazyListView/index.vue'

import SchemeManage from '../scheme/index.vue'
import { versionDescendingOrder } from '@/lib/utils.js'

export default {
  name: 'release-detail',
  components: {
    ReleaseEditorLayout, SchemeManage, ReleaseEditorContract, LazyListView, ResourceSearch
  },
  data() {
    return {
      release: null,
      targetResourceId: '',
      targetResourceDetail: null,
      vTabActiveName: 'scheme',
      selectedVersion: '',
      selectedVersionIndex: 0,
      isVersionSelectorVisible: false,
      resourceDialogVisible: false,
      contracts: [],
      depReleasesList: [],
      depReleasesDetailList: [],
      resolvedReleases: [],
      resignResolvedReleases: [],
      releasesTreeData: [],
      searchInput: '',
      searchResources: [],
    }
  },
  computed: {
    releaseId() {
      return this.$route.params.releaseId
    },
    resourceProjection() {
      return ['resourceId', 'resourceType', 'aliasName', 'createDate', 'status'].join(',')
    },
  },
  watch: {
    targetResourceId() {
      this.fetchResourceDetail()
    },
  },
  methods: {
    fetchResourceDetail() {
      this.$services.resource.get(this.targetResourceId)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.targetResourceDetail = res.data
            this.depReleasesList = this.targetResourceDetail ? this.targetResourceDetail.systemMeta.dependencies : []
          }else {
            this.$message({ type: 'error', message: res.msg })
          }
        })
        .catch(e => this.$message({ type: 'error', message: e.toString() }))
    },
    fetchReleaseDetail() {
      this.$services.ReleaseService.get(this.releaseId)
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.release = res.data
            const { resourceId, version } = this.release.latestVersion
            this.selectedVersion = this.release.selectedVersion = version
            this.targetResourceId = resourceId
            this.targetResourceDetail = res.data.resourceInfo
            // this.depReleasesList = this.targetResourceDetail ? this.targetResourceDetail.systemMeta.dependencies : []
            this.formatReleaseData()
            this.fetchEveryVersionRDetail()
          }
        })
    },
    formatReleaseData() {
      this.release.resourceVersions = this.release.resourceVersions.map(i => {
        i.createDate = format(i.createDate, 'YYYY-MM-DD')
        return i
      })
    },
    fetchEveryVersionRDetail() {
      this.$services.resource.get('list', {
        params: {
          resourceIds: this.release.resourceVersions.map(r => r.resourceId).join(','),
          projection: 'aliasName,resourceId,resourceType,createDate,intro',
        }
      })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            const map = {}
            res.data = res.data.forEach(resource => map[resource.resourceId] = resource)
            this.release.resourceVersions = this.release.resourceVersions.sort(versionDescendingOrder).map(resource => {
              resource = Object.assign(resource, map[resource.resourceId])
              resource.createDate = format(resource.createDate, 'YYYY-MM-DD')
              return resource
            })
          }else {
            this.$message({ type: 'error', message: res.msg })
          }
        })
        .catch(e => this.$message({ type: 'error', message: e.toString() }))
    },
    // 切换 发行版本
    exchangeVersion(item, index) {
      this.targetResourceId = item.resourceId
      this.selectedVersion = item.version
      this.release.selectedVersion = item.version
      this.selectedVersionIndex = index
    },
    exchangeVTab(tab) {
      this.vTabActiveName = tab.name
    },
    showResourceDialog() {
      this.resourceDialogVisible = true

      // if(this.release.policies.length > 0) {
      //   this.resourceDialogVisible = true
      // }else {
      //   this.$message({ type: 'warning', message: '发行没策略，不能新增版本' })
      // }
    },
    addNewVersion(resource) {
      if(resource.resourceType === this.release.resourceType) {
        const rVersions = this.release.resourceVersions
        for(let i = 0; i < rVersions.length; i++) {
          if(rVersions[i].resourceId === resource.resourceId) {
            this.$message({
              type: 'warning',
              message: `不可用：所选资源与该发行版本${rVersions[i].version}的资源相同`,
              duration: 5000
            })
            return
          }
        }

        this.$router.push(`/release/add?releaseId=${this.release.releaseId}&resourceId=${resource.resourceId}`)
      }else {
        this.$message({ type: 'warning', message: `所选资源的类型必须为${this.release.resourceType}`, duration: 5000 })
      }
    },
    updateResolvedReleases(resolvedReleases) {
      this.resolvedReleases = resolvedReleases
    },
    // 立即签约
    signedImmediately() {
      this.updateReleaseScheme()
    },
    updateReleaseScheme(msg) {
      const resolvedReleases = this.resolvedReleases
      this.$services.ReleaseService.put(`${this.releaseId}/versions/${this.selectedVersion}`, {
        resolveReleases: resolvedReleases
      })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            const { resolveReleases } = res.data
            this.updateSchemeContracts(resolveReleases)
            this.$message({ type: 'success', message: msg || '签约成功！' })
          }
        })
    },
    updateSchemeContracts(resolveReleases) {
      const leng = resolveReleases.length
      const existedContractIDs = this.contracts.map(c => c.contractId)
      const targetContractIDs = []
      for(let i = 0; i < leng; i++) {
        const { contracts = [] } = resolveReleases[i]
        contracts.forEach(c => {
          if(c.contractId && existedContractIDs.indexOf(c.contractId) === -1) {
            targetContractIDs.push(c.contractId)
          }
        })
      }

      if(targetContractIDs.length) {
        // 获取 合同详情
        this.$services.ContractRecords.get({
          params: {
            contractIds: targetContractIDs.join(',')
          }
        })
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.contracts = [ ...this.contracts, ...res.data ]
            }
          })
      }
    }
  },
  created() {
    this.fetchReleaseDetail()
  }
}
