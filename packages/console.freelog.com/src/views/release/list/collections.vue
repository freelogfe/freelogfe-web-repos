<i18n src="./release-list.json"></i18n>
<template>
  <section class="my-collections">
    <div class="m-c-header clearfix">
      <router-link :to="releasesMarketLink">
        <el-button size="medium" type="primary" class="m-c-go-to-market">{{$t('goToMarket')}}</el-button>
      </router-link>
      <div class="right-tool-bar-wrap">
        <search-input @search="searchHandler" showInputImmediately></search-input>
      </div>
    </div>
    <release-items-list type='myCollections' :query="queryInput"></release-items-list>
  </section>
</template>

<script>
import SearchInput from '@/components/SearchInput/index.vue'
import ReleaseItemsList from './list.vue'

export default {
  name: 'release-collections',
  data() {
    return {
      resourceList: [],
      queryInput: '',
      releasesMarketLink: '/'
    }
  },
  components: {
    ReleaseItemsList,
    SearchInput,
  },

  methods: {
    searchHandler(str) {
      this.queryInput = str
    },
  },

  mounted() {
  },
}
</script>

<style lang="less" scoped>
  @import '../../../styles/variables.less';
  .my-collections {
    width: @main-content-width-1190;
    margin: auto;
    padding-top: 50px;
    padding-left: 50px;
  }
  .m-c-header {
    margin-bottom: 40px;
    .m-c-go-to-market {
      width:160px; border-radius: 2px;
    }
    .right-tool-bar-wrap {
      float: right;
    }
  }
  @media screen and (max-width: 1250px){
    .my-collections {
      width: @main-content-width-990;
    }
  }
</style>
