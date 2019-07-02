<template>
  <div class="resource-items">
    <lazy-list-view :list="resources" :height="itemHeight" :fetch="fetchData">
      <template slot-scope="scope" v-if="scope.data.isFavor !== false">
        <el-button v-if="type === 'favor'"
                   @click="delFavorResourceHandler(scope.data)"
                   type="primary" plain round
                   class="del-favor-release-btn">{{$t('resourceDetailView.deleteFavorText')}}
        </el-button>
        <resource-item :resource="scope.data"
                       :type="type"
                       class="my-res-item"
                       :navTo="gotoDetailHandler"></resource-item>
      </template>
      <div slot="empty" class="empty-resource-tip">
        {{isSelf? $t('resourceListView.noResources') : $t('resourceListView.noFavorResources')}}
      </div>
    </lazy-list-view>
  </div>
</template>

<script>
  import LazyListView from '@/components/LazyListView/index.vue'
  import ResourceItem from '../list-item/index.vue'

  export default {
    name: 'resource-items',

    data() {
      return {
        search: '',
        resources: [],
        loader: null
      }
    },

    props: {
      type: {
        type: String,
        default() {
          return 'self'
        }
      },
      query: String
    },

    computed: {
      isSelf() {
        return this.type === 'self'
      },
      itemHeight(){
        return this.type === 'self' ? 90: 60
      }
    },

    watch: {
      type() {
        this.initView()
      },
      query() {
        this.initView()
      }
    },
    components: {ResourceItem, LazyListView},
    mounted() {
      this.initView()
    },

    methods: {
      gotoDetailHandler(resource) {
        if (resource.status === 2 || this.type !== 'self') {
          this.$router.push({path: `/resource/detail/${resource.resourceId}`})
        }
      },
      initView() {
        switch (this.type) {
          case 'favor':
            this.loader = this.getFavorResourcesLoader()
            break
          case 'self':
            this.loader = this.getSelfResourcesLoader()
            break
          case 'all':
          default:
            break
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
        return this.loader({page}).then((data) => {
          this.resources = this.resources.concat(data.dataList)

          if (data.dataList.length < pageSize) {
            data.canLoadMore = false
          } else {
            data.canLoadMore = true
          }
          data.dataList.sort((r1,r2) => +new Date(r2.updateDate) - (+new Date(r1.updateDate)))
          return data
        })
      },
      getSelfResourcesLoader() {
        return this.createResourceLoader(param => this.$services.resource.get(param || {}).then(res => res.getData()))
      },
      getFavorResourcesLoader() {
        return this.createResourceLoader(param => {
          return this.$services.collections.get(param || {}).then(res => res.getData()).then(data=>{
            if (data && data.dataList) {
              data.dataList.forEach(resource=>{
                resource.isFavor = true
              })
            }
            return data
          })
        })
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
                page: 1,
                isSelf: 1
              }, param)
            }
          }
          return loader(param)
        }
      },
      delFavorResourceHandler(resource) {
        return this.$services.collections.delete(resource.resourceId).then((res) => {
          if (res.data.errcode === 0) {
            this.$message.success(this.$t('resourceDetailView.deleteFavorSuccessText'))
            resource.isFavor = false
          } else {
            this.$error.showErrorMessage(res)
          }
        })
      },
      getAllResourcesLoader(param) {
        param = {
          pageSize: 1e2
        }
        if (typeof param === 'object') {
          param = {
            params: param
          }
        }
        return this.$services.resource.get(param || {}).then(res => res.getData())
      }
    }
  }
</script>

<style lang="less" scoped>
  .resource-items {
    .empty-resource-tip {
      font-size: 20px;
      color: #999;
    }

    .del-favor-release-btn {
      float: right;
      margin-top: 8px;
      margin-right: 10px;
    }

    .my-res-item {
      border-bottom: 1px solid #E9E9E9;
      /*padding-bottom: 10px;*/
    }
  }
</style>
