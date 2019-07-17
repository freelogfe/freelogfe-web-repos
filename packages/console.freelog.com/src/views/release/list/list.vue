<template>
  <div class="release-list">
    <f-pagination class="release-list-table"
              ref="listRef"
              :config="tableConfig"
              :formatHandler="formatHandler"
              :pagination="paginationConfig"
              :empty-text="pagenationEmptyText">
      <template slot="list">
        <el-table-column label="发行名称">
          <template slot-scope="scope">
            <div class="r-l-item-name-box" @click="goToReleaseDetail(scope.row)">
                <img 
                  class="r-l-item__img" 
                  :class="{'resource-default-preview':!previewImage}" 
                  :src="scope.row.previewImage" />
                <div class="r-l-item-name" :title="scope.row.releaseName">{{scope.row.releaseName}}</div>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="发行类型" width="140">
          <template slot="header" slot-scope="scope">
            <el-select class="r-l-types-select" v-model="selectedType" size="mini">
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
        <el-table-column label="最新版本" width="120">
          <template slot-scope="scope">
            <div> {{scope.row.latestVersion.version}}</div>
          </template>
        </el-table-column>
        <el-table-column label="策略" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.policies.length"> 
              <el-popover placement="bottom-start" width="370" trigger="hover">
                <div slot="reference">
                  <div class="r-l-item-policy-row1">{{scope.row.policies[0].policyName}}</div>
                  <div class="r-l-item-policy-row2" v-show="scope.row.policies.length > 1">等{{scope.row.policies.length}}个策略…</div>
                </div>
                <f-policy-tabs :policies="scope.row.policies"></f-policy-tabs>
              </el-popover>
            </div>
            <div class="r-l-item-no-policy" v-else>暂无策略</div> 
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="更新时间" width="180" v-if="type ==='myReleases' ">
          <template slot-scope="scope">
            <div class="r-l-item-date-row1">{{scope.row.updateDate | fmtDate}}</div>
            <div class="r-l-item-date-row2">加入时间 {{scope.row.createDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="collectionDate" label="收藏时间" width="180" v-else>
          <template slot-scope="scope">
            <div class="r-l-item-date-row1">{{scope.row.collectionDate | fmtDate}}</div>
            <div class="r-l-item-date-row2">更新时间 {{scope.row.updateDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column width="130">
          <template slot="header" slot-scope="scope">
            <el-select class="r-l-types-select" v-model="selectedReleaseStatus" size="mini" v-if="type === 'myReleases'">
              <el-option
                v-for="item in releaseStatusArray"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="" v-else>
              {{releaseStatusArray[0].label}}
            </span>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-online" v-if="scope.row.isOnline">已上线</div>
            <div class="r-l-item-offline" v-else>
              未上线 
              <el-tooltip :content="scope.row.policies.length > 0 ? '策略已下架' : '暂无策略' " placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <router-link :to="scope.row._toMangeDetailLink" v-if="type === 'myReleases'">
              <el-button class="r-l-item-edit-btn" size="mini">编辑</el-button>
            </router-link>
            <el-button 
              v-if="type === 'myCollections'"
              class="r-l-item-cancel-favor-btn" 
              type="danger" 
              size="mini" 
              @click="cancelCollection(scope.row)">取消收藏</el-button>
            <!-- <router-link :to="scope.row._toDetailLink" v-if="scope.row.isOnline">
              <el-button class="r-l-item-detail-btn" size="mini">详情</el-button>
            </router-link> -->
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import FPagination from '@/components/Pagination/index.vue'
  import FPolicyTabs from '@/components/PolicyTabs/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'
  import { RELEASE_STATUS } from '@/config/release'

  const [ NO_RIGHT_RELEASE, NO_CREATED_RELEASE, NO_COLLECTED_RELEASE ] = [ '没有符合条件的发行', '您还没有创建任何发行。', '您还没有收藏任何发行。您在发行市场收藏的发行之后将会出现在这里。' ]
  export default {
    name: 'release-items-list',

    components: { FPagination, FPolicyTabs },

    props: {
      type: {
        type: String,
        default: 'myReleases'
      },
      query: String
    },

    data() {
      return {
        search: '',
        loader: null,
        tableConfig: {
          rowClassName: 'release-row',
          'cell-class-name': 'rel-row-cell',
          'show-header': true
        },
        paginationConfig: {
          reloadCount: 0,
          target: '/v1/releases',
          params: {
            isSelf: 1,
            resourceType: undefined,
            keywords: undefined,
            status: undefined
          }
        },
        selectedType: 'all',
        pagenationEmptyText: '',
        selectedReleaseStatus: 0
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
      releaseStatusArray() {
        return RELEASE_STATUS.map((val, index) => {
          return { label: val, value: index }
        })
      }
    },

    watch: {
      selectedType() {
        if(this.selectedType === 'all') {
          this.paginationConfig.params.resourceType = undefined
        }else {
          this.paginationConfig.params.resourceType = this.selectedType
        }
      },
      selectedReleaseStatus() {
        // 0: 全部状态；1: 已上线；2: 已下线
        switch(this.selectedReleaseStatus) {
          case 0: {
            this.paginationConfig.params.status = undefined
            break
          }
          case 1: {
            this.paginationConfig.params.status = 1
            break
          }
          case 2: {
            this.paginationConfig.params.status = 0
            break
          }
          default: {}
        }
      },
      query() {
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
        switch(this.type) {
          case 'myReleases': {
            this.paginationConfig.target = '/v1/releases'
            this.pagenationEmptyText = NO_CREATED_RELEASE
            break
          }
          case 'myCollections': {
            this.paginationConfig.target = '/v1/collections/releases'
            this.pagenationEmptyText = NO_COLLECTED_RELEASE
            break
          }
          default: {}
        }
      },
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        list = list.map(release => {
          const { releaseId, policies = [], previewImages, latestVersion, status } = release
          let isOnline = false
          for(let i = 0; i < policies.length; i++) {
            if(policies[i].status === 1) {
              isOnline = true
              break
            }
          }
          release.policies = policies
          release.isOnline = isOnline
          release._toDetailLink = release.releaseId ? `/release/detail/${releaseId}?version=${latestVersion.version}` : ''
          release._toMangeDetailLink = `/release/edit/${releaseId}`
          release.previewImage = previewImages && previewImages[0] || ''
          if(this.type === 'myCollections') {
            release.updateDate = release.releaseUpdateDate
            release.createDate = release.latestVersion.createDate
          }
          return release
        })

        return list
      },
      cancelCollection(release) {
        this.$services.collections.delete(release.releaseId)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.$message({ type: 'success', message: '取消成功！' })
              this.paginationConfig.reloadCount = this.paginationConfig.reloadCount + 1
            }
          })
      },
      goToReleaseDetail(release) {
        this.$router.push(release._toDetailLink)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./list.less";
</style>

<style lang="less">
.release-list-table {
  .r-l-types-select {
    display: block; width: 120px; padding: 0;
    .el-input { line-height: 28px; padding: 0; }
    .el-input__inner { 
      padding-left: 0; padding-right: 22px; border: none; 
      font-size: 14px;
    }
  }
}
</style>

