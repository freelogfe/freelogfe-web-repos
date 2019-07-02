<template>
  <section class="index-main-container">
    <!--<el-input placeholder="请输入搜索内容" v-model="query" class="query-input" @keyup.enter.native="queryHandler"-->
    <!--@keydown.native="autoQueryHandler">-->
    <!--<el-button slot="append" icon="el-icon-search" type="primary" @click="queryHandler"></el-button>-->
    <!--</el-input>-->

    <div class="main-content-wrap">
      <lazy-list-view itemClass="resource-list-item"
                      class="resource-list"
                      ref="resourceList"
                      :list="resourceList"
                      :height="275"
                      :fetch="fetchReleaseData">
        <template slot-scope="scope">
          <list-item :release="scope.data"></list-item>
        </template>
        <!--占位居中-->
        <template slot="append">
          <div class="res-placeholder-item"></div>
          <div class="res-placeholder-item"></div>
          <div class="res-placeholder-item"></div>
          <div class="res-placeholder-item"></div>
          <div class="res-placeholder-item"></div>
          <div class="res-placeholder-item"></div>
        </template>
      </lazy-list-view>
    </div>
  </section>
</template>

<script>
import IndexMainView from './index'

export default IndexMainView
</script>

<style lang="less" scoped>
  @import "index.less";
</style>

<style lang="less">
  .index-main-container {
    .fl-lazy-list-view.resource-list  {
      > ul {
        display: flex;
        flex-wrap: wrap;
        margin-left: -20px;
        justify-content: center;
      }
    }

    .res-placeholder-item,
    .resource-list-item{
      width: 220px;
      margin-left: 20px;
    }

    .resource-list-item {
      border-radius: 4px;
      background-color: #FFFFFF;
      margin-bottom: 20px;
      box-shadow: rgba(0, 0, 0, .2) 0 2px 2px 0;
    }
  }
</style>
