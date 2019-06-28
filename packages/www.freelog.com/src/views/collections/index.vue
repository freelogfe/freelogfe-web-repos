<template>
  <div class="my-collections-view">
    <el-form :inline="true" class="search-input-wrap">
      <el-form-item>
        <el-input size="small"
                  style="width: 400px"
                  suffix-icon="el-icon-search"
                  :placeholder="$t('common.searchPlaceholder')"
                  v-model="searchInput"></el-input>
      </el-form-item>
    </el-form>

    <fl-pagination class="my-collection-list"
                   :config="tableConfig"
                   :rowClickHandler="rowClickHandler"
                   :pagination="paginationConfig">
      <template slot="list">
        <el-table-column
                :label="$t('collections.tableColumn[0]')">
          <template slot-scope="scope">
            <div>
              <p class="resource-name">{{ scope.row.releaseName }}</p>
              <div>
                <!--<span class="resource-status" :class="['status-'+scope.row.status]">{{ resolveStatus(scope.row.status) }}</span>-->
                <span class="resource-type">{{scope.row.resourceType}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
                :label="$t('collections.tableColumn[1]')"
                width="200">
          <template slot-scope="scope">
            <div class="node-domain">
              {{scope.row.authorName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
                width="145"
                :label="$t('collections.tableColumn[2]')">
          <template slot-scope="scope">
            {{scope.row.updateDate |fmtDate}}
          </template>
        </el-table-column>
      </template>
    </fl-pagination>
  </div>
</template>

<script>
import FlPagination from '@/components/Pagination/index.vue'

export default {
  name: 'my-collections',

  data() {
    return {
      searchInput: '',
      tableConfig: {
        rowClassName: 'resource-row',
        'cell-class-name': 'res-row-cell'
      },
      paginationConfig: {
        target: 'v1/collections/releases',
        params: {}
      }
    }
  },
  components: {
    FlPagination
  },

  mounted() {

  },
  methods: {
    rowClickHandler() {
      // const { targetId, nodeInfo: { nodeId }, resourceId } = row
      // this.$router.push({
      //   path: '/resources/detail/',
      //   query: {
      //     resourceId,
      //     presentableId: targetId,
      //     partyTwo: nodeId
      //   }
      // })
    },
    resolveStatus(status) {
      const $i18n = this.$i18n
      let text
      switch (status) {
        case 1:
          text = $i18n.t('collections.contractStatus.inactive')
          break
        case 2:
          text = $i18n.t('collections.contractStatus.inactive')
          break
        case 3:
          text = $i18n.t('collections.contractStatus.active')
          break
        case 4:
        case 5:
        case 6:
          text = $i18n.t('collections.contractStatus.termination')
          break
        default:
          text = $i18n.t('collections.contractStatus.unknown')
      }

      return text
    },
    searchHandler() {
      this.$message.warning('未开始设计')
      // debugger
      // // this.$set(this.paginationConfig, 'params',{
      // //   keyWords: this.searchInput
      // // })
      // this.paginationConfig.params.keyWords = this.searchInput
      // console.log(this.paginationConfig)
    }
  }
}
</script>

<style lang="less" type="text/less">
  @import "../../styles/mixin.less";
  .my-collections-view {
    background-color: white;
    padding: 20px;
    .search-input-wrap {
      .el-select .el-input .el-input__inner {
        border: none;
      }
    }

    .my-collection-list {
      color: #222222;
      font-size: 14px;
      .resource-row {
        cursor: pointer;
      }

      .resource-row {
        color: #222222;
        font-size: 14px;
      }
      .resource-name {
        .text-ellipsis;
        font-size: 14px;
        font-weight: bold;
      }

      .resource-status {
        font-size: 12px;
        border: 1px solid;
        border-radius: 8px;
        padding: 0 8px;
        margin-right: 5px;
        transform: scale(.85);
        display: inline-block;
        height: 16px;
        vertical-align: middle;
        line-height: 18px;

        &.status-1,
        &.status-2 {
          border-color: #E99331;
          color: #E99331;
        }

        &.status-3 {
          border-color: #00C075;
          color: #00C075;
        }

        &.status-4,
        &.status-5,
        &.status-6 {
          border-color: transparent;
          color: white;
          background-color: #DA6666;
        }
      }

      .resource-type {
        font-size: 12px;
        color: #999999;
      }
    }

  }
</style>
