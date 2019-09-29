<i18n src="./tools.i18n.json"></i18n>
<template>
  <div class="tool-resource-list">
    <div class="trl-header">
      <el-dropdown class="trl-status-select" @command="handleSelectReleaseStatus">
        <h3 class="el-dropdown-link">
          <span>{{$t('resourceListTitle')}}</span> {{releaseStatus[selectedReleaseStatus].label}}<i class="el-icon-caret-bottom"></i>
        </h3>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in releaseStatus" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="trl-btn-group">
        <el-button type="primary" @click="refreshResourcesList">刷新列表</el-button>
        <el-button type="success" @click="batchUpdateResources">批量更新资源</el-button>
        <el-button type="success" @click="batchCreateReleases">批量创建新发行</el-button>
      </div>
    </div>
    
    <f-pagination class="resource-list-table"
              ref="resourcesListRef"
              :config="tableConfig"
              :formatHandler="formatHandler"
              :pagination="paginationConfig"
              :empty-text="pagenationEmptyText"
              :selectionChangeHandler="handleSelectionChange">
      <template slot="list">
        <el-table-column type="selection" width="45" :selectable="(row) => row.systemMeta.dependencies.length === 0"></el-table-column>
        <el-table-column :label="$t('resourceList.name')">
          <template slot-scope="scope">
            <div class="r-l-item-name-box">
              <div class="r-l-item-name" v-if="!scope.row.isEdittingName">
                <el-button type="primary" size="mini" >{{scope.row.dependType}}</el-button>
                {{scope.row.aliasName}}
                <i class="el-icon-edit" @click="scope.row.isEdittingName = true"></i>
              </div>
              <el-input v-model="scope.row.aliasName" placeholder="请输入资源名称" v-else></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resourceList.type')" width="176">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="r-l-types-select" @command="handleSelectType">
              <span class="el-dropdown-link">
                {{$t('resourceList.type')}} {{selectedType === 'all' ? '': ` ${selectedType}`}}<i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in resourceTypes" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-type"> {{scope.row.resourceType}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="依赖" width="140" v-if="selectedReleaseStatus === 0">
          <template slot-scope="scope">
            <div class="trl-dependencies" v-for="dep in scope.row.systemMeta.dependencies" :key="dep.resourceId">
              {{dep.releaseName}}
            </div>
            <div class="trl-no-dependencies" v-if="scope.row.systemMeta.dependencies.length === 0">
              无依赖...<i class="el-icon-circle-plus"></i>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column class="trl-tpls" label="发行策略模版" width="140" v-if="selectedReleaseStatus === 0">
          <template slot-scope="scope">
            <div class="trl-tpls" :class="{'disabled': scope.row.systemMeta.dependencies.length > 0}">
              <el-radio class="p-tpl-radio" 
                v-model="scope.row.releasePolicyType" 
                v-for="tpl in releasePolicyTpls"
                :key="tpl.type"
                :label="tpl.type">{{tpl.name}}</el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('resourceList.operate')" width="240">
          <template slot-scope="scope">
            <!-- <el-button class="r-l-item-release-btn" size="mini" @click="tapRelease(scope.row)">{{$t('resourceList.releaseBtnText')}}</el-button> -->
            <router-link :to="scope.row._toDetailLink">
              <el-button class="r-l-item-detail-btn" size="mini">{{$t('resourceList.detailBtnText')}}</el-button>
            </router-link>
            <el-button class="r-l-item-save-btn" size="mini" @click="tapSaveBtn(scope.row)">{{$t('resourceList.saveBtnText')}}</el-button>
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import FPagination from '@/components/Pagination/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'
  import policyTpls from '@/components/PolicyEditor/defaultPolicyTpls.js'

  export default {
    name: 'tool-resource-list',
    components: { FPagination },
    props: {
      query: String
    },
    data() {
      const NO_REACTED_RESOURCE = this.$i18n.t('resourceList.messages[1]')
      const $i18n = this.$i18n

      return {
        search: '',
        loader: null,
        tableConfig: {
          rowClassName: 'resource-row',
          'cell-class-name': 'rel-row-cell',
          'show-header': true
        },
        paginationConfig: {
          target: `/v1/resources`,
          params: {
            isSelf: 1,
            resourceType: undefined,
            keywords: undefined,
            isReleased: 0               // 0: 未发行；1: 已发行；2: 全部发行
          }
        },
        resourceMapReleases: {},
        selectedType: 'all',
        releaseStatus: [
          { label: $i18n.t('resourceList.releaseStatus[0]'), value: 0 }, 
          { label: $i18n.t('resourceList.releaseStatus[1]'), value: 1 }, 
          { label: $i18n.t('resourceList.releaseStatus[2]'), value: 2 }
        ],
        selectedReleaseStatus: 0,
        pagenationEmptyText: NO_REACTED_RESOURCE,
        selectedResources: []
      }
    },
    computed: {
      resourceTypes() {
        const $i18n = this.$i18n
        const arr = [{ label: $i18n.t('resourceList.allTypes'), value: 'all' }]
        for(let [label, value] of Object.entries(RESOURCE_TYPES)) {
          arr.push({ label, value })
        }
        return arr
      },
      policyTplsMap() {
        const map = {}
        policyTpls.release.forEach(pTpl => {
          const { type }  = pTpl
          map[type] = pTpl
        })
        return map
      },
      releasePolicyTpls() {
        return policyTpls.release
      }
    },
    watch: {
      query() {
        const [ NO_RIGHT_RESOURCE, NO_REACTED_RESOURCE ] = [ this.$i18n.t('resourceList.messages[0]'), this.$i18n.t('resourceList.messages[1]') ]
        if(this.query == '') {
          this.paginationConfig.params.keywords = undefined
          this.pagenationEmptyText = NO_REACTED_RESOURCE
        }else {
          this.paginationConfig.params.keywords = this.query
          this.pagenationEmptyText = NO_RIGHT_RESOURCE
        }
      },
      selectedReleaseStatus() {
        this.paginationConfig.params.isReleased = this.selectedReleaseStatus
      },
    },
    methods: {
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        list = list.map(resource => {
          const { resourceId, previewImages } = resource
          // resource._toDetailLink = resourceId ? `/resource/detail/${resourceId}` : ''
          resource._toDetailLink = resourceId ? `/resource/editor/${resourceId}` : ''
          resource._downloadLink = `${window.FreelogApp.Env.qiOrigin}/v1/resources/${resourceId}/download`
          resource.previewImage = previewImages && previewImages[0] || ''
          resource.releaseStatus = 'fetching'
          resource.releaseList = []
          resource.isEdittingName = false
          resource.releasePolicyType = 'free'
          resource.dependType = resource.systemMeta.dependencies.length === 0 ? "单一" : "复合"

          this.fetchReleaseList(resourceId)
            .then(() => {
              resource.releaseStatus = 'done'
              resource.releaseList = this.resourceMapReleases[resource.resourceId]
            })
          return resource
        })

        list.sort((r1, r2) => +new Date(r2.updateDate) - (+new Date(r1.updateDate)))
        return list
      },
      batchFetchReleaseList(list) {
        const pArray = []
        for(let i = 0; i < list.length; i++) {
          const resourceId = list[i].resourceId
          if(!this.resourceMapReleases[resourceId]) {
            pArray.push(this.fetchReleaseList(resourceId))
          }
        }
        return Promise.all(pArray)
      },
      // 获取单个资源"所属发行列表"
      fetchReleaseList(resourceId) {
        if(!this.resourceMapReleases[resourceId]) {
          return this.$services.ResourceService.get(`${resourceId}/releases`)
            .then(res => res.data)
            .then(res => {
              if(res.errcode === 0) {
                this.resourceMapReleases[resourceId] = res.data
              }
            })
        }else {
          return Promise.resolve(this.resourceMapReleases[resourceId])
        }
      },
      // 更新资源
      updateResourceDetail(resource) {
        const { aliasName, resourceId } = resource
        return this.$services.resource.put(resourceId, {
          aliasName,
        })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.$message.success(`${resource.aliasName}更新成功！！！`)
            return Promise.resolve()
          }else {
            this.$message.error(`${resource.aliasName}更新失败！！！`)
            return Promise.reject()
          }
        })
      },
      // 创建新发行
      createNewRelease(resource) {
        const { resourceId, aliasName, policies } = resource
        return this.$services.ReleaseService.post({
          resourceId,
          policies,
          releaseName: aliasName,
          baseUpcastReleases: [],
          resolveReleases: [],
        })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.$message.success(`“${res.data.releaseName}”创建成功！！！`)
            return Promise.resolve()
          }else {
            this.$message.error(`创建失败：${res.msg}！！！`)
            return Promise.reject()
          }
        })
      },
      goToReleaseDetail(release) {
        if(release.releaseId) {
          this.$router.push(`/release/detail/${release.releaseId}?version=${release.resourceVersion.version}`)
        }
      },
      handleSelectType(command) {
        this.selectedType = command
        if(this.selectedType === 'all') {
          this.paginationConfig.params.resourceType = undefined
        }else {
          this.paginationConfig.params.resourceType = this.selectedType
        }
      },
      handleSelectReleaseStatus(command) {
        this.selectedReleaseStatus = command
        this.paginationConfig.params.isReleased = this.selectedReleaseStatus
      },
      tapRelease(resource) {
        this.$emit('release', resource)
      },
      // 更新单个资源
      tapSaveBtn(resource) {
        this.updateResourceDetail(resource)
          .then(() => {
            this.refreshResourcesList()
          })
      },
      handleSelectionChange(selections) {
        this.selectedResources = selections
      },
      refreshResourcesList() {
        this.$refs.resourcesListRef.reload()
      },
      batchUpdateResources() {
        const count = this.selectedResources.length
        var i = 0
        if(this.selectedResources.length) {
          this.selectedResources.forEach(resource => {
            this.updateResourceDetail(resource)
              .then(() => {
                resource.isEdittingName = false
              })
              .finally(() => {
                i++
                if(count === i) {
                  this.refreshResourcesList()
                }
              }) 
          })
        }else {
          this.$message.warning('请先选择需更新的资源')
        }
      },
      batchCreateReleases() {
        const count = this.selectedResources.length
        var i = 0
        if(count) {
          this.selectedResources.forEach(resource => {
            const { resourceId, releasePolicyType } = resource
            const { name, template } = this.policyTplsMap[releasePolicyType]
            resource.policies = [
              { policyName: name, policyText: window.btoa(template) }
            ]
            this.createNewRelease(resource)
              .finally(() => {
                i++
                if(count === i) {
                  this.refreshResourcesList()
                }
              }) 
          })
        }else {
          this.$message.warning('请先选择需发行的资源')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.tool-resource-list {
  .trl-header {
    height: 72px;
    background-color: #f5f5f5;
    .trl-status-select { 
      display: inline-block; 
      margin-top: 36px; transform: translateY(-50%);
      .el-dropdown-link {
        padding: 0 20px; font-size: 16px; color: #409eff;
        span { color: #000; }
      }
    }
    .trl-btn-group {
      float: right;
      padding: 15px 20px; border-bottom: 1px solid #eee; 
      
    }
  }

  .r-l-item-name-box {
    display: flex; align-items: center;
    .r-l-item__img {
      min-width: 45px; max-width: 45px; height: 35px;
    }
    .r-l-item-name {
      font-weight: 600;
    }
  }
  
  .r-l-item-name, 
  .r-l-item-type, 
  .r-l-item-updateDate{
    font-size: 14px; line-height: 22px; color: #000;
  }

  .r-l-item-name {
    .el-button { padding: 4px 6px; transform: scale(.8); }
    .el-icon-edit { cursor: pointer; }
  }
  .r-l-item-name, .r-l-item-release-row1{
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .r-l-item-release-row1 {
    color: #409EFF; font-weight:600;
    &:hover {
      text-decoration: underline; cursor: pointer;
    }
  }

  .r-l-item-no-release {
    color: #999;
  }

  .r-l-item-release-row2 {
    display: inline-block;
    font-size: 12px; color: #666; line-height: 17px;
  }

  .r-l-item-createDate {
    font-size: 12px; line-height: 17px; color: #BFBFBF;
  }
  
  .r-l-item-release-btn, .r-l-item-save-btn, .r-l-item-detail-btn {
    padding: 4px 10px; margin-left: 0; margin-right: 5px;
  }
  .p-tpl-radio { margin-right: 8px; }

  .trl-dependencies {}
  .trl-no-dependencies {
    .el-icon-circle-plus {
      float: right; line-height: 24px;
      font-size: 20px; color: #67C23A; cursor: pointer;
    }
  }
  .trl-tpls {
    &.disabled { opacity: .3; pointer-events: none; }
  }
}
</style>
<style lang="less">
  .r-l-item-release-floatbox {
    .release-item {
      display: flex;
      span {
        display: inline-block; margin: 5px;
        &.name {
          width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;
          text-decoration: underline;
        }
        &.version { width: 70px; }
        &.date { width: 90px; }
      }
    }
  }
  .resource-list-table {
    .r-l-types-select, .r-l-status-select {
      display: block; padding: 0;
    }
  }
</style>
