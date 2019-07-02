import { sessionStore } from '@/lib'

export default {
  name: 'table-view',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    formatHandler: {
      type: Function,
      default: null
    },
    paginationOptions: {
      type: Object,
      default() {
        return {
          pageSizes: [10, 20, 30, 50]
        }
      }
    },
    loader: Function,
    pageMeta: {
      type: Object,
      default() {
        // 记忆上一次查看的页码
        const histroyPage = sessionStore.get(`PAGE_${this.$route.fullPath}_index`) || {}
        return Object.assign({
          pageSize: 10,
          page: 1 // 页码
        }, histroyPage)
      }
    }
  },
  beforeDestroy() {
    if (this.pageMeta && this.pageMeta.keyWords) {
      delete this.pageMeta.keyWords
    }
    sessionStore.set(`PAGE_${this.pageUrl}_index`, this.pageMeta)
  },
  mounted() {
    this.pageUrl = this.$route.fullPath
    this.tableData = this.data
    this.total = this.tableData.length
    this.load()

    this.$on('reload', this.reload.bind(this))
  },
  methods: {
    reload(params) {
      this.load(params)
    },
    load(pageInfo) {
      Object.assign(this.pageMeta, pageInfo || {})
      if (this.loader) {
        this.loading = true
        this.loader(this.pageMeta).then((res) => {
          const data = res.getData()
          this.loading = false
          if (data) {
            let dataList = data.dataList || data
            if (this.formatHandler) {
              dataList = this.formatHandler(dataList)
            }
            this.tableData = dataList
            // 分页数据
            if (data.dataList) {
              this.total = data.totalItem
              this.pageMeta.page = data.page || 1
            } else {
              this.total = dataList.length
            }
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => {
          // this.$message.warning('加载失败')
          console.warn('加载失败')
          this.loading = false
        })
      }
    },
    handleSizeChange(val) {
      const data = { pageSize: val }
      this.load(data)
      this.$emit('sizeChange', data)
    },
    handleCurrentChange(val) {
      const data = { page: val }
      this.load(data)
      this.$emit('pageChange', data)
    }
  }
}
