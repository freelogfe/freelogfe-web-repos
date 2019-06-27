<template>
  <div class="my-resources-wrap">
    <el-form :inline="true" class="search-input-wrap">
      <el-form-item>
        <el-select v-model="searchForm.type"
                   size="small"
                   style="width: 140px"
                   :placeholder="$t(`resources.searchType.placeholder`)">
          <el-option
                  v-for="(item, index) in searchTypes"
                  :key="item.value"
                  :label="$t(`resources.searchType.label[${index}]`)"
                  :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input size="small"
                  style="width: 400px"
                  suffix-icon="el-icon-search"
                  :placeholder="$t('common.searchPlaceholder')"
                  @keyup.native.enter="searchHandler"
                  v-model="searchForm.input"></el-input>
      </el-form-item>
    </el-form>

    <fl-pagination class="my-resource-list"
                   v-if="isReady"
                   :config="tableConfig"
                   :rowClickHandler="rowClickHandler"
                   :pagination="paginationConfig">
      <template slot="list">
        <el-table-column
                :label="$t(`resources.tableColumn[0]`)">
          <template slot-scope="scope">
            <div>
              <p class="resource-name">{{ scope.row.resourceInfo.resourceName }}</p>
              <div>
                <span class="resource-status" :class="['status-'+scope.row.status]">{{ resolveStatus(scope.row.status) }}</span>
                <span class="resource-type">{{scope.row.resourceInfo.resourceType}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
                :label="$t(`resources.tableColumn[1]`)"
                width="350">
          <template slot-scope="scope">
            <div class="node-domain">
              {{formatNodeDomain(scope.row.nodeInfo)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
                width="155"
                :label="$t(`resources.tableColumn[2]`)">
          <template slot-scope="scope">
            {{scope.row.createDate |fmtDate}}
          </template>
        </el-table-column>
      </template>
    </fl-pagination>
  </div>
</template>


<script>
import FlPagination from '@/components/Pagination/index.vue'

export default {
  name: 'my-resources',
  data() {
    return {
      searchForm: {
        type: 'resource',
        input: ''
      },
      searchTypes: [{
        value: 'node',
      }, {
        value: 'resource',
      }, {
        value: 'resourceType',
      }],

      isReady: false,

      tableConfig: {
        rowClassName: 'resource-row',
        'cell-class-name': 'res-row-cell'
      },
      paginationConfig: {
        target: '/v1/getMyResources.json',
        params: {

        }
      }
    }
  },

  components: {
    FlPagination
  },

  created() {
    this.$store.dispatch('getCurrentUserInfo').then((user) => {
      if (user && user.userId) {
        this.paginationConfig.params.partyTwo = user.userId
        this.isReady = true
      }
    })
  },

  mounted() {
  },

  methods: {
    rowClickHandler(row) {
      const {
        targetId, resourceId, partyTwo
      } = row

      this.$router.push({
        path: '/user/resources/detail/',
        query: {
          resourceId,
          presentableId: targetId,
          partyTwo
        }
      })
    },
    formatNodeDomain(nodeInfo) {
      if (nodeInfo && nodeInfo.nodeDomain) {
        return `${nodeInfo.nodeDomain}.${window.FreelogApp.Env.mainDomain}`
      } else {
        return ''
      }
    },
    resolveStatus(status) {
      let text
      switch (status) {
        case 1:
          text = '不可用'
          break
        case 2:
          text = '不可用'
          break
        case 4:
          text = '可用'
          break
        case 3:
        case 5:
        case 6:
          text = '合同终止'
          break
        default:
          text = '未知状态'
      }

      return text
    },
    searchHandler() {
      this.$message.warning('未开始设计')
    }
  }
}
</script>

<style lang="less">
  @import "index.less";
</style>
