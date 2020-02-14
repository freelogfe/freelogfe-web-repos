<!--<i18n src="./tools.i18n.json"></i18n>-->
<template>
  <div class="tool-release-list">
    <div class="trl-header">
      <h3><span>{{$t('tools.releaseListTitle')}}</span></h3>
      <div class="trl-btn-group">
        <template v-if="selectedReleases.length">
          <el-button type="success" @click="batchCreatePresentables">批量创建节点发行</el-button>
        </template>
        <el-button type="primary" @click="refreshReleasesList">刷新列表</el-button>
      </div>
    </div>

    <f-pagination class="release-list-table"
              ref="releaseslistRef"
              :config="tableConfig"
              :formatHandler="formatHandler"
              :pagination="paginationConfig"
              :empty-text="pagenationEmptyText"
              :selectionChangeHandler="handleSelectionChange">
      <template slot="list">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column :label="$t('tools.releaseList.name')">
          <template slot-scope="scope">
            <div class="trl-item-name-box" @click="goToReleaseDetail(scope.row)">
              <el-button type="primary" size="mini">{{scope.row.latestVersion.version}}</el-button>
              <div class="trl-item-name" :title="scope.row.releaseName">{{scope.row.releaseName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tools.releaseList.type')" width="160">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="trl-types" @command="handleSelectType">
              <span class="el-dropdown-link">
                {{$t('tools.releaseList.type')}} {{selectedType === 'all' ? '': ` ${selectedType}`}}<i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in resourceTypes" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div class="trl-item-type"> {{scope.row.resourceType}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tools.releaseList.policyTpls')" width="160">
          <template slot-scope="scope">
            <div>
              <el-radio class="p-tpl-radio"
                v-model="scope.row.presentablePolicyType"
                v-for="tpl in presentablePolicyTpls"
                :key="tpl.type"
                :label="tpl.type">{{tpl.name}}</el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="节点选择" width="160">
          <template slot-scope="scope">
            <el-select class="trl-node-select" v-model="scope.row.checkedNodeId" placeholder="请选择签约节点">
              <el-option
                v-for="node in nodes"
                :key="node.nodeId"
                :disabled="scope.row.rSubordinateNodesIds.indexOf(node.nodeId) !== -1"
                :label="node.nodeName + (scope.row.rSubordinateNodesIds.indexOf(node.nodeId) !== -1 ? '（已签约）':'')"
                :value="node.nodeId"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tools.releaseList.operate')" width="145">
          <template slot-scope="scope">
            <router-link :to="scope.row._toMangeDetailLink">
              <el-button class="trl-item-edit-btn" size="mini">{{$t('tools.releaseList.editBtnText')}}</el-button>
            </router-link>
            <el-button class="trl-item-create-btn" type="primary" size="mini" v-if="scope.row.checkedNodeId !== ''" @click="createPresentable(scope.row)">{{$t('tools.releaseList.createBtnText')}}</el-button>
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import FPagination from '@/components/Pagination/index.vue'
  import FPolicyTabs from '@/components/PolicyTabs/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'
  import { RELEASE_STATUS } from '@/config/release'
  import policyTpls from '@/components/PolicyEditor/defaultPolicyTpls.js'

  export default {
    name: 'tool-release-list',
    props: {},
    components: { FPagination, FPolicyTabs },
    data() {
      const qResourceType = this.$route.query.resourceType
      return {
        search: '',
        loader: null,
        tableConfig: {
          rowClassName: 'release-row',
          'cell-class-name': 'rel-row-cell',
          'show-header': true
        },
        paginationConfig: {
          pageSize: 20,
          reloadCount: 0,
          target: '/v1/releases',
          params: {
            isSelf: 1,
            resourceType: qResourceType != null ? qResourceType : undefined,
            keywords: undefined,
            status: undefined
          }
        },
        selectedType: qResourceType != null ? qResourceType : 'all',
        pagenationEmptyText: '',
        checkedNodeId: '',
        selectedReleases: []
      }
    },
    computed: {
      resourceTypes() {
        const $i18n = this.$i18n
        const arr = [{ label: $i18n.t('releaseList.allTypes'), value: 'all' }]
        for(let [label, value] of Object.entries(RESOURCE_TYPES)) {
          arr.push({ label, value })
        }
        return arr
      },
      releaseStatusArray() {
        return RELEASE_STATUS.map((val, index) => {
          return { label: val, value: index }
        })
      },
      policyTplsMap() {
        const map = {}
        policyTpls.presentable.forEach(pTpl => {
          const { type }  = pTpl
          map[type] = pTpl
        })
        return map
      },
      presentablePolicyTpls() {
        return policyTpls.presentable
      },
      ...mapGetters({
        session: 'session',
        nodes: 'nodes'
      }),
    },
    watch: {
      query() {
        const $i18n = this.$i18n
        const [ NO_RIGHT_RELEASE, NO_CREATED_RELEASE, NO_COLLECTED_RELEASE ] = [ $i18n.t('releaseList.messages[0]'), $i18n.t('releaseList.messages[1]'), $i18n.t('releaseList.messages[2]') ]
        if(this.query == '') {
          this.paginationConfig.params.keywords = undefined
          this.pagenationEmptyText = this.type === 'myReleases' ? NO_CREATED_RELEASE : NO_COLLECTED_RELEASE
        }else {
          this.paginationConfig.params.keywords = this.query
          this.pagenationEmptyText = NO_RIGHT_RELEASE
        }
      }
    },
    mounted() {
      this.initView()
    },
    methods: {
      initView() {
        const $i18n = this.$i18n
        const NO_CREATED_RELEASE = $i18n.t('releaseList.messages[1]')
        this.paginationConfig.target = '/v1/releases'
        this.pagenationEmptyText = NO_CREATED_RELEASE
      },
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        const releaseMap = {}
        list = list.map(release => {
          const { releaseId, policies = [], previewImages, latestVersion, status } = release
          let isOnline = false
          for(let i = 0; i < policies.length; i++) {
            if(policies[i].status === 1) {
              isOnline = true
              break
            }
          }

          release.checkedNodeId = ''
          release.isOnline = isOnline
          release._toDetailLink = release.releaseId ? `/release/detail/${releaseId}?version=${latestVersion.version}` : ''
          release._toMangeDetailLink = `/release/edit/${releaseId}`
          release.previewImage = previewImages && previewImages[0] || ''
          release.presentablePolicyType = 'free'
          if(this.type === 'myCollections') {
            release.updateDate = release.releaseUpdateDate
            release.createDate = release.latestVersion.createDate
          }
          release.rSubordinateNodesIds = []
          releaseMap[releaseId] = release
          return release
        })
        list.sort((r1, r2) => +new Date(r2.updateDate) - (+new Date(r1.updateDate)))

        const releaseList = list
        this.fetchReleaseSubordinateNodes(list.map(item => item.releaseId).join(','))
          .then(res => {
            if(res.errcode === 0) {
              res.data.forEach(presentable => {
                const { releaseInfo: { releaseId }, nodeId } = presentable
                const release = releaseMap[releaseId]
                release.rSubordinateNodesIds.push(nodeId)
              })
            }
          })
        return list
      },
      refreshReleasesList() {
        this.$refs.releaseslistRef.reload()
      },
      goToReleaseDetail(release) {
        this.$router.push(release._toDetailLink)
      },
      goToMangeDetailLink(release) {
        this.$router.push(release._toMangeDetailLink)
      },
      handleSelectType(command) {
        this.selectedType = command
        this.$router.push({
          query: { resourceType: command }
        })
        if(this.selectedType === 'all') {
          this.paginationConfig.params.resourceType = undefined
        }else {
          this.paginationConfig.params.resourceType = this.selectedType
        }
      },
      // 查询当前发行已签约生成presentables列表，从而获知发行已和哪些节点签约
      fetchReleaseSubordinateNodes(releaseIds) {
        return this.$services.PresentablesService.get(`list`, {
          params: {
            releaseIds,
            userId: this.session.user.userId,
            projection: 'nodeId,releaseInfo'
          }
        }).then(res => res.data)
      },
      batchCreatePresentables() {
        const count = this.selectedReleases.length
        var i = 0
        if(count) {
          this.selectedReleases.forEach(release => {
            this.createPresentable(release)
              .finally(() => {
                i++
                if(count === i) {
                  this.refreshReleasesList()
                }
              })
          })
        }
      },
      createPresentable(release) {
        const { checkedNodeId: nodeId, presentablePolicyType, policies, username, latestVersion, releaseId, releaseName } = release
        const presentableName = releaseName.replace(new RegExp(`${username}/`, 'i'), '').replace(/(\s*)/g, '')
        const { name: policyName, template } = this.policyTplsMap[presentablePolicyType]

        const resolveReleases = this.getResolveReleases(release)
        const data = {
          presentableName, nodeId, releaseId,
          policies: [ { policyName, policyText: window.btoa(template) } ],
          version: latestVersion.version,
          resolveReleases,
        }

        return this.$services.PresentablesService.post(data)
                .then(res => res.data)
                .then(res => {
                  if(res.errcode === 0) {
                    this.$message.success(`节点发行「${res.data.presentableName}」创建成功！`)
                    release.rSubordinateNodesIds.push(nodeId)
                  }else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(e => {
                  this.$message.error(e)
                })
      },
      upgradePresentable() {
        const {presentableId, releaseInfo: {version, releaseId}} = presentable
        this.$services.ReleaseService.get(releaseId)
          .then(res => res.data)
          .then(res => {
            var _version = version
            if (res.errcode === 0) {
                const { latestVersion } = res.data
                _version = latestVersion.version
            }
            return _version
          })
          .then(_v => {
            return this.$services.PresentablesService.put(`${presentableId}/switchPresentableVersion`, {version: _v})
          })
          .then(res => res.data)
          .then(res => {
              if (res.errcode === 0) {
                  this.$message({type: 'success', message: '升级成功！'})
              } else {
                  this.$message({type: 'error', message: '升级失败！'})
              }
          })
          .catch(this.$error.showErrorMessage)
      },
      getResolveReleases(release) {
        const { policies, releaseId, baseUpcastReleases } = release
        var resolveReleases = [
          { releaseId, contracts: policies.map(({policyId}) => { return { policyId }}) }
        ]
        const tmpArr = baseUpcastReleases.map(r => {})
        return resolveReleases
      },
      handleSelectionChange(selections) {
        this.selectedReleases = selections
      },

    }
  }
</script>

<style lang="less" scoped>
.tool-release-list {
  .trl-header {
    position: relative; background-color: #f5f5f5;

    h3 {
      height: 72px;  padding: 0 20px;
      span { line-height: 72px; font-size: 16px; }
    }
    .trl-btn-group {
      position: absolute; top: 0; right: 0;
      padding: 15px 20px; border-bottom: 1px solid #eee;
    }
  }

  .trl-item-name-box {
    display: flex; align-items: center; cursor: pointer;
    transform: translateX(-8px);

    .el-button { width: 62px; padding: 4px 6px; transform: scale(.7); }

    .trl-item-name {
      font-weight: 600;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .trl-item-name,
  .trl-item-type,
  .trl-item-policy-row1,
  .trl-item-no-policy,
  .trl-item-date-row1,
  .trl-item-online,
  .trl-item-offline {
    font-size: 14px; line-height: 22px; color: #000;
  }

  .trl-item-name, .trl-item-policy-row1{
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .trl-item-policy-row1 {
    position: relative;
    color: #409EFF; font-weight:600;

    &:hover {
      .trl-item-policy-add { display: block; }
    }

    .trl-item-policy-add {
      display: none;
      position: absolute; top: 1px; right: 0; z-index: 10;
      width: 26px; height: 20px; border-radius: 10px;
      background-color: #409eff; color: #fff; text-align: center;
    }
  }

  .trl-item-no-policy { color: #999; }

  .trl-item-policy-row2 { font-size: 12px; color: #666; line-height: 17px; }

  .trl-item-date-row2 {
    font-size: 12px; line-height: 17px; color: #BFBFBF;
  }

  .trl-item-offline {
    color: #BFBFBF;
  }

  .trl-item-edit-btn, .trl-item-detail-btn, .trl-item-cancel-favor-btn, .trl-item-create-btn {
    padding: 4px 8px; margin-right: 8px; margin-left: 0;
  }
}

</style>
<style lang="less">
  .tool-release-list {
    .trl-types {
      display: block; padding: 0; color: #000;
    }
  }
  .trl-node-select {
    .el-input__inner { height: 34px; line-height: 34px; font-size: 12px; }
    .el-input__icon { line-height: 34px; }
  }
</style>
