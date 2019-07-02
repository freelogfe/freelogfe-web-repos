<template>
  <div class="table-view-wrapper" v-loading.body="loading">
    <el-table
      class="table"
      :data="tableData"
      stripe
      border>
      <slot></slot>
    </el-table>
    <el-pagination
      v-show="showPagination"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :background="true"
      :current-page="pageMeta.page"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageMeta.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import TableView from './index'

export default TableView
</script>

<style lang="less" scoped>
.table-view-wrapper {
  .table {
    max-height: 100%;
  }

  .pagination {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
