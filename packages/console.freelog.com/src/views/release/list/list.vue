<template>
  <div class="release-list">
    <f-pagination class="release-list-table"
              :config="tableConfig"
              :formatHandler="formatHandler"
              ref="listRef"
              :pagination="paginationConfig">
      <template slot="list">
        <el-table-column label="发行名称">
          <template slot-scope="scope">
            <div class="r-l-item-name-box">
              <img 
                class="r-l-item__img" 
                :class="{'resource-default-preview':!previewImage}" 
                :src="scope.row.previewImage" />
              <div class="r-l-item-name" :title="scope.row.releaseName">{{scope.row.releaseName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发行类型" width="140">
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
              <div class="r-l-item-policy-row1">{{scope.row.policies[0].policyName}}</div>
              <div class="r-l-item-policy-row2" v-show="scope.row.policies.length > 1">等{{scope.row.policies.length}}个策略…</div>
            </div>
            <div class="r-l-item-no-policy" v-else>暂无策略</div> 
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" sortable label="更新时间" width="180">
          <template slot-scope="scope">
            <div class="r-l-item-updateDate">{{scope.row.updateDate | fmtDate}}</div>
            <div class="r-l-item-createDate">加入时间 {{scope.row.createDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="全部状态" width="130">
          <template slot-scope="scope">
              <div class="r-l-item-online" v-if="scope.row.isOnline">已上线</div>
              <div class="r-l-item-offline" v-else>
                未上线 
                <el-tooltip  content="Bottom center" placement="top" effect="light">
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
              @click="cancelCollection">取消收藏</el-button>
            <router-link :to="scope.row._toDetailLink" v-if="scope.row.isOnline">
              <el-button class="r-l-item-detail-btn" size="mini">详情</el-button>
            </router-link>
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import FPagination from '@/components/Pagination/index.vue'

  export default {
    name: 'release-items-list',

    components: { FPagination },

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
            isSelf: 1
          }
        },
      }
    },

    watch: {
      query() {
        this.initView()
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
            break
          }
          case 'myCollections': {
            this.paginationConfig.target = '/v1/releases'
            // this.paginationConfig.target = '/v1/collections/releases'
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
          const { releaseId, policies, previewImages, latestVersion } = release
          let isOnline = false
          for(let i = 0; i < policies.length; i++) {
            if(policies[i].status === 1) {
              isOnline = true
              break
            }
          }
          release.isOnline = isOnline
          release._toDetailLink = release.releaseId ? `/release/detail/${releaseId}?version=${latestVersion.version}` : ''
          release._toMangeDetailLink = `/release/edit/${releaseId}`
          release.previewImage = previewImages && previewImages[0] || ''
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
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./list.less";
</style>
