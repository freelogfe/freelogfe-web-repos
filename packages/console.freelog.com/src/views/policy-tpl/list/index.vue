<template>
  <section>
    <div class="top-sec">
      <router-link class="route-link" :to="getCreateLink">
        <el-button type="primary">{{$t('policy.createTemplate')}}</el-button>
      </router-link>
    </div>
    <table-view class="policy-tpl-list" :loader="loader()">
      <el-table-column
        prop="id"
        label="ID"
        width="350px">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('policy.templateName')">
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('policy.status')">
        <template slot-scope="scope">
          {{resolveStatus(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column
        label=""
        align="center"
        width="200px">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.row)">{{$t('policy.details')}}
          </el-button>
        </template>
      </el-table-column>
    </table-view>
  </section>
</template>

<script>
import PolicyTplList from './index'

export default PolicyTplList
</script>

<style lang="less" scoped>
  .top-sec {
    margin-bottom: 15px;
  }
</style>
