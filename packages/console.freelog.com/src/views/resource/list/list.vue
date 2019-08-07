<template>
  <div class="resource-list">
    <f-pagination class="resource-list-table"
              :config="tableConfig"
              :formatHandler="formatHandler"
              ref="listRef"
              :pagination="paginationConfig"
              :empty-text="pagenationEmptyText">
      <template slot="list">
        <el-table-column label="资源名称">
          <template slot-scope="scope">
            <div class="r-l-item-name-box">
              <img 
                class="r-l-item__img" 
                :class="{'resource-default-preview':!previewImage}" 
                :src="scope.row.previewImage" />
              <div class="r-l-item-name" :title="scope.row.aliasName">{{scope.row.aliasName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资源类型" width="140">
          <template slot="header" slot-scope="scope">
            <el-select class="r-l-types-select" v-model="selectedType" placeholder="类型" size="mini">
              <el-option
                v-for="item in resourceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-type"> {{scope.row.resourceType}}</div>
          </template>
        </el-table-column>
        <el-table-column label="历史发行" width="200">
          <template slot="header" slot-scope="scope">
            <el-select class="r-l-status-select" v-model="selectedReleaseStatus" placeholder="发行情况" size="mini">
              <el-option
                v-for="item in releaseStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-no-release">
              {{scope.row.releaseStatus === 'fetching' ? 
              '查询中...' : scope.row.releaseList.length ? '' : '暂无发行'}}
            </div>
            <div style="position: relative;" v-if="scope.row.releaseList.length">
              <div class="r-l-item-release-row1" @click="goToReleaseDetail(scope.row.releaseList[0])">{{scope.row.releaseList[0].releaseName}}</div>
              <template  v-if="scope.row.releaseList.length > 1">
                <el-popover placement="bottom-start" width="370" trigger="hover">
                  <div class="r-l-item-release-row2" slot="reference">等{{scope.row.releaseList.length}}个发行...</div>
                  <div class="r-l-item-release-floatbox">
                    <div class="release-item" v-for="(r, index) in scope.row.releaseList" :key="'r'+index">
                      <span class="name" @click="goToReleaseDetail(r)">{{r.releaseName}}</span>
                      <span class="version">{{r.resourceVersion.version}}</span>
                      <span class="date">{{r.resourceVersion.createDate | fmtDate}}</span>
                    </div>
                  </div>
                </el-popover>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="更新时间" width="180">
          <template slot-scope="scope">
            <div class="r-l-item-updateDate">{{scope.row.updateDate | fmtDate}}</div>
            <div class="r-l-item-createDate">加入时间 {{scope.row.createDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button class="r-l-item-release-btn" size="mini" @click="tapRelease(scope.row)">发行</el-button>
            <router-link :to="scope.row._toDetailLink">
              <el-button class="r-l-item-detail-btn" size="mini">编辑</el-button>
            </router-link>
            <a :href="scope.row._downloadLink" :download="scope.row.aliasName">
              <el-button class="r-l-item-download-btn" size="mini">下载源文件</el-button>
            </a>
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import FPagination from '@/components/Pagination/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'

  const [ NO_RIGHT_RESOURCE, NO_REACTED_RESOURCE ] = [ '没有符合条件的资源', '您还没有创建任何资源。' ]
  export default {
    name: 'resource-items-list',

    components: { FPagination },

    props: {
      query: String
    },

    data() {
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
            isReleased: 2
          }
        },
        resourceMapReleases: {},
        selectedType: 'all',
        releaseStatus: [{ label: '未发行', value: 0 }, { label: '已发行', value: 1 }, { label: '全部发行情况', value: 2 }],
        selectedReleaseStatus: 2,
        pagenationEmptyText: NO_REACTED_RESOURCE
      }
    },

    computed: {
      resourceTypes() {
        const arr = [{ label: '全部类型', value: 'all' }]
        for(let [label, value] of Object.entries(RESOURCE_TYPES)) {
          arr.push({ label, value })
        }
        return arr
      },
    },

    watch: {
      selectedType() {
        if(this.selectedType === 'all') {
          this.paginationConfig.params.resourceType = undefined
        }else {
          this.paginationConfig.params.resourceType = this.selectedType
        }
      },
      query() {
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

    mounted() {
      
    },

    methods: {
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        list = list.map(resource => {
          const { resourceId, previewImages } = resource
          resource._toDetailLink = resourceId ? `/resource/detail/${resourceId}` : ''
          resource._downloadLink = `${window.FreelogApp.Env.qiOrigin}/v1/resources/${resourceId}/download`
          resource.previewImage = previewImages && previewImages[0] || ''
          resource.releaseStatus = 'fetching'
          resource.releaseList = []
          
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
      tapRelease(resource) {
        this.$emit('release', resource)
      },
      goToReleaseDetail(release) {
        if(release.releaseId) {
          this.$router.push(`/release/detail/${release.releaseId}?version=${release.resourceVersion.version}`)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./list.less";
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
      display: block; width: 120px; padding: 0;
      .el-input { line-height: 28px; padding: 0; }
      .el-input__inner { 
        padding-left: 0; padding-right: 22px; border: none; 
        font-size: 14px;
      }
    }
  }
</style>
