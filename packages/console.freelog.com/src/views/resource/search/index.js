import LazyListView from '@/components/LazyListView/index.vue'
import ResourceItem from '../list-item/index.vue'
import ResourceList from '../list/list.vue'

export default {
  name: 'search-resource',
  data() {
    return {
      searchInput: '',
      activeName: 'search',
      favorResources: [],
      searchResources: []
    }
  },
  components: {
    ResourceItem,
    ResourceList,
    LazyListView
  },
  props: {
    searchScope: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  mounted() {
    this.$refs.searchInputRef.focus()
    this.loader = this.getFavorResourcesLoader()
  },
  methods: {
    addResourceHandler(resource) {
      this.$emit('add', resource)
    },
    clearSearchInputHandler() {
      // this.searchResources = []
    },
    getFavorResourcesLoader() {
      return this.createResourceLoader(param => this.$services.collections.get(param || {}).then(res => res.getData()))
    },
    createResourceLoader(loader) {
      return (param) => {
        param = param || {
          pageSize: 10,
          page: 1
        }
        if (typeof param === 'object') {
          param = {
            params: Object.assign({
              pageSize: 10,
              page: 1
            }, param)
          }
        }
        return loader(param)
      }
    },
    fetchData(page) {
      const pageSize = 10
      if (!this.loader) {
        return Promise.resolve({
          canLoadMore: false,
          dataList: []
        })
      }
      return this.loader({ page }).then((data) => {
        this.favorResources = this.favorResources.concat(data.dataList)
        if (data.dataList.length < pageSize) {
          data.canLoadMore = false
        }
        return data
      })
    },
    searchDataHandler(page) {
      const pageSize = 10

      if (!this.searchInput) {
        return Promise.resolve({ canLoadMore: false })
      }

      return this.$services.ResourceService.get({
        params: Object.assign({
          keyWords: encodeURIComponent(this.searchInput),
          page,
          pageSize
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
    searchHandler() {
      this.activeName = 'search'
      this.searchResources = []
      this.$refs.searchView.refresh()
    }
  }
}
