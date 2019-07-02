<template>
  <section class="my-resources">
    <h3 class="title">{{$t('resource.myResources')}}</h3>
    <div class="body-content">
      <el-tabs tab-position="top" v-model="curTabName">
        <el-tab-pane :label="$t('resourceListView.myListTitle')" name="self">
          <lazy-component>
            <resource-items type="self" :query="selfQueryInput"></resource-items>
          </lazy-component>
        </el-tab-pane>
        <!--<el-tab-pane :label="$t('resourceListView.favorListTitle')" name="favor">-->
          <!--<lazy-component>-->
            <!--<resource-items type="favor" :query="favorQueryInput"></resource-items>-->
          <!--</lazy-component>-->
        <!--</el-tab-pane>-->
      </el-tabs>
      <div class="right-tool-bar-wrap">
        <ul class="tool-bars">
          <li class="tool-item">
            <search-input @search="searchHandler"></search-input>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import ResourceList from './index'

export default ResourceList
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
