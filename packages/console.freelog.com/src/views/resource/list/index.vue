<!--<i18n src="./resource-list.i18n.json"></i18n>-->
<template>
  <section class="my-resources">
    <div class="m-r-header clearfix">
      <div class="right-tool-bar-wrap">
        <el-input class="search-input" size="medium" ref="input" v-model="searchInputStr"
          :class="{ 'focus': isInputFocus }"
          :style="{width: '300px'}"
          @focus="focusHandler"
          @blur="blurHandler"
          @keyup.enter.native="searchHandler(searchInputStr)">
          <i class="freelog fl-icon-content" :slot="isInputFocus ? 'suffix' : 'prefix'" @click="searchHandler(searchInputStr)"></i>
        </el-input>
        <!-- <search-input @search="searchHandler" showInputImmediately></search-input> -->
      </div>
      <router-link to="/resource/editor" target="_blank">
        <el-button size="medium" type="primary" class="m-r-create-btn">{{$t('resource.createBtnText')}}</el-button>
      </router-link>
    </div>

    <resource-items-list :query="queryInput" @release="showReleaseDialog"></resource-items-list>

    <el-dialog width="750px"
               top="10vh"
               center
               :visible.sync="isShowReleaseSearchDialog">
      <release-search
        :release-source="targetReleaseResource"
        :tabLayout="['my-release']"
        :historicalReleases="targetReleaseResource ? targetReleaseResource.releaseList : []"
        @add="releaseSearchHandler"></release-search>
      <div class="" slot="footer">
        <el-button round type="primary" class="create-release-btn" @click="createNewRelease">{{$t('resource.createNewReleaseText')}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import SearchInput from '@/components/SearchInput/index.vue'
import CONFIG from '@/config/index'
import ResourceItemsList from './list.vue'
import ReleaseSearch from '@/views/release/search/index.vue'

const { RESOURCE_STATUS } = CONFIG

export default {
  name: 'resource-list',
  data() {
    return {
      resourceList: [],
      RESOURCE_STATUS,
      queryInput: '',
			searchInputStr: '',
			isInputFocus: false,
      isShowReleaseSearchDialog: false,
      targetReleaseResource: null,
    }
  },
  components: {
    ResourceItemsList,
    SearchInput,
    ReleaseSearch
  },

  mounted() {

  },
  methods: {
		focusHandler() {
			this.isInputFocus = true
		},
		blurHandler() {
			this.isInputFocus = false
		},
    searchHandler(str) {
      this.queryInput = str
      // this.$message.warning('todo')
    },
    showReleaseDialog(resource) {
      this.isShowReleaseSearchDialog = true
      this.targetReleaseResource = resource
    },
    releaseSearchHandler(release) {
      this.isShowReleaseSearchDialog = false
      window.open(`/release/add?releaseId=${release.releaseId}&resourceId=${this.targetReleaseResource.resourceId}`)
      // this.$router.push(`/release/add?releaseId=${release.releaseId}&resourceId=${this.targetReleaseResource.resourceId}`)
    },
    // 创建一个全新的发行
    createNewRelease() {
      // 跳转 发行中间页
      this.isShowReleaseSearchDialog = false
      window.open(`/release/create?resourceId=${this.targetReleaseResource.resourceId}`)
      // this.$router.push(`/release/create?resourceId=${this.targetReleaseResource.resourceId}`)
    },
  }
}

</script>

<style lang="less" scoped>
  @import '../../../styles/variables.less';
  .my-resources {
    width: @main-content-width-1190;
    margin: auto;
    padding-top: 30px;
    .el-dialog__header{ padding: 0; }
  }
  .m-r-header {
    margin-bottom: 28px; text-align: right;
    .m-r-create-btn {
      width:120px; margin-left: 18px; border-radius: 2px;
    }
    .right-tool-bar-wrap {
      display: inline-block;
    }
  }
  @media screen and (max-width: 1250px){
    .my-resources {
      width: @main-content-width-990;
    }
  }
</style>
<style lang="less">
  .my-resources {
    .el-dialog__header{
      padding: 0;
      .el-dialog__headerbtn { z-index: 100; }
    }
  }
</style>

