<!--<template>-->
<!--  <section>-->
<!--    <div class="group-top-sec">-->
<!--      <router-link class="route-link" to="/group/create">-->
<!--        <el-button type="primary">创建新分组</el-button>-->
<!--      </router-link>-->
<!--    </div>-->
<!--    <table-view class="group-list" :loader="loader()">-->
<!--      <el-table-column-->
<!--        prop="groupName"-->
<!--        label="分组描述">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="groupId"-->
<!--        label="分组 Id">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="分组类型">-->
<!--        <template slot-scope="scope">-->
<!--          {{resolveGroupType(scope.row)}}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="成员数量">-->
<!--        <template slot-scope="scope">-->
<!--          {{scope.row.memberCount|humanizeNumber}}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="small"-->
<!--            @click="groupDetailHandler(scope.row)">管理-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </table-view>-->
<!--  </section>-->
<!--</template>-->

<!--<script>-->
<!--import GroupList from './index'-->

<!--export default GroupList-->
<!--</script>-->

<!--<style lang="less" scoped>-->
<!--  .group-top-sec {-->
<!--    margin-bottom: 15px;-->
<!--  }-->

<!--  .route-link {-->
<!--    color: white-->
<!--  }-->
<!--</style>-->
