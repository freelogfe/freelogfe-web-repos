<template>
  <div>
    <el-input
            class="r-e-w-search-input"
            v-model="searchInput"
            clearable
            ref="searchInputRef"
            @clear="clearSearchInputHandler"
            @keyup.native.enter="searchHandler"
            :placeholder="$t('search.resourcePlaceholder')"
    ></el-input>
    <lazy-list-view :list="searchResources"
                    ref="searchView"
                    class="r-e-w-s-resource-list"
                    :height="60" 
                    :fetch="searchDataHandler">
      <template slot-scope="scope">
        <div class="r-e-w-s-r-item">
          <span class="r-e-w-s-r-name">{{scope.data.aliasName}}</span>
          <span class="r-e-w-s-r-type">{{scope.data.resourceType}}</span>
          <span class="r-e-w-s-r-date">{{scope.data.createDate | fmtDate}}</span>
          <span class="r-e-w-s-r-select-btn" @click="selectResource(scope.data)">选择</span>
        </div>
      </template>
    </lazy-list-view>
  </div>
</template>

<script>

import LazyListView from '@/components/LazyListView/index.vue'
export default {
  name: 'resource-search',
  components: {
    LazyListView
  },
  data() {
    return {
      searchInput: '',
      searchResources: [],
      isFirstSearch: true
    }
  },
  computed: {
    resourceProjection() {
      return ['resourceId', 'resourceType', 'aliasName', 'createDate', 'status'].join(',')
    },
  },
  methods: {
    clearSearchInputHandler() {

    },
    searchHandler() {
      this.searchResources = []
      this.$refs.searchView.refresh()
    },
    // 资源搜索
    searchDataHandler(page) {
      const pageSize = 10

      // if (!this.searchInput && !this.isFirstSearch) {
      //   return Promise.resolve({ canLoadMore: false })
      // }
      // this.isFirstSearch = false
      // 空输入时，即查询所有属于我的资源
      return this.$services.ResourceService.get({
        params: Object.assign({
          keywords: encodeURIComponent(this.searchInput),
          page,
          pageSize,
          isSelf: 1,
          projection: this.resourceProjection
        }, this.searchScope)
      }).then((res) => {
        const data = res.getData() || {}
        if (res.data.errcode === 0) {
          this.searchResources = this.searchResources.concat(data.dataList)
          if (data.dataList.length < pageSize) {
            data.canLoadMore = false
          }
        } else {
          data.canLoadMore = false
        }
        return data
      })
    },
    selectResource(resource) {
      this.$emit('select-resource', resource)
    },
    // 获取单个资源"所属发行列表"
    fetchReleaseList(resourceId) {
      if(!this.resourceMapReleases[resourceId]) {
        return this.$services.ResourceService.get(`${resourceId}/releases`)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.resourceMapReleases[resourceId] = res.data
            }
          })
      }else {
        return Promise.resolve(this.resourceMapReleases[resourceId])
      }
    },
  },
}
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../styles/variables.less';

  .r-e-w-search-input { margin-bottom: 20px; }

  .r-e-w-s-r-item { margin: 15px 0; }
  span { display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
  .r-e-w-s-r-name { width: 220px; color: #333; }
  .r-e-w-s-r-type, .r-e-w-s-r-date { width: 90px; font-size: 12px; color: #999; }
  .r-e-w-s-r-select-btn {
    float: right; cursor: pointer;
    padding: 2px 10px; border-radius: 13px;
    font-size: 12px; background-color: #409EFF; color: #fff;
  }
</style>
