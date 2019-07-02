<template>
  <section class="my-resources">
    <h3 class="title">{{$t('release.myReleases')}}</h3>
    <div class="body-content">
      <el-tabs tab-position="top" v-model="curTabName">
        <el-tab-pane :label="$t('resourceListView.myListTitle')" name="self">
          <lazy-component>
            <release-items-list type="self" :query="selfQueryInput"></release-items-list>
          </lazy-component>
        </el-tab-pane>
        <!--<el-tab-pane :label="$t('resourceListView.favorListTitle')" name="favor">-->
          <!--<lazy-component>-->
            <!--<release-list type="favor" :query="favorQueryInput"></release-list>-->
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
