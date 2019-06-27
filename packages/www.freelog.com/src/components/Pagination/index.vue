<template>
  <div class="fl-pagination" v-loading="loading">
    <el-table
            ref="table"
            @row-click="rowClickHandler"
            v-bind="tableProps"
            style="width: 100%"
            :empty-text="$t('pagination.emptyText')"
    >
      <slot name="list"></slot>
    </el-table>
    <div class="fl-pg-ft clearfix">
      <slot name="footer"></slot>
      <div class="fl-pg-info">
        <el-button style="margin-right: 10px" type="text" v-if="hasPrev" @click="gotoFirstPageHandler">&lt;&lt; {{$t('pagination.start')}}
        </el-button>
        <el-button type="text" v-if="hasPrev" @click="loadPrevHandler">&lt; {{$t('pagination.prev')}}</el-button>
        <span class="fl-pg-num">
          <span v-if="to>0 && to > from">{{from}}-{{to}}{{$t('pagination.bar')}}，</span>{{$t('pagination.total')}}{{total}}{{$t('pagination.bar')}}</span>
        <el-button style="margin-right: 10px" type="text" v-if="hasNext" @click="loadNextHandler">{{$t('pagination.next')}} &gt;</el-button>
        <el-button type="text" v-if="hasNext" @click="gotoLastPageHandler">{{$t('pagination.end')}} &gt;&gt;</el-button>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'fl-pagination',
  data() {
    return {
      total: 0,
      tableProps: {
        data: []
      },
      currentPage: parseInt(window.sessionStorage.getItem(`${this.$route.fullPath}_current_page`)) || 1,
      pageSize: 10,
      loading: false
    }
  },

  props: {
    pagination: {
      type: Object,
      default() {
        return {
          pageSize: 10
        }
      }
    },
    config: Object,
    rowClickHandler: {
      type: Function,
      default: () => {
      }
    }
  },

  watch: {
    pagination: {
      deep: true,
      handler() {
        Object.assign(this.tableProps, this.config)
        this.reload()
      }
    }
  },

  mounted() {
    Object.assign(this.tableProps, this.config)
    this.pageSize = this.pagination.pageSize || 10
    this.load()
  },
  methods: {
    loadData() {
      if (!this.pagination.target) {
        throw new Error('need pagination target param')
      }

      const params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }

      if (this.pagination.params) {
        Object.assign(params, this.pagination.params)
      }

      return this.$axios.get(this.pagination.target, {
        params
      }).then((res) => {
        if (res.data.ret === 0 && res.data.errcode === 0) {
          return res.data.data
        }
        throw new Error(res.data.msg)
      })
    },
    update(data) {
      if (!data || !data.dataList) return
      this.total = data.totalItem
      this.tableProps.data = data.dataList
    },
    reload() {
      this.currentPage = 1
      this.load()
    },
    load() {
      if (this.loading) return

      this.loading = true
      this.loadData().then(this.update.bind(this))
        .then(() => {
          this.loading = false
          window.sessionStorage.setItem(`${this.$route.fullPath}_current_page`, this.currentPage)
        })
        .catch((err) => {
          this.$error.showErrorMessage(err)
          this.loading = true
        })
    },
    loadNextHandler() {
      this.currentPage += 1
      this.load()
    },
    loadPrevHandler() {
      this.currentPage -= 1
      this.load()
    },
    gotoLastPageHandler() {
      this.currentPage = Math.ceil(this.total / this.pageSize)
      this.load()
    },
    gotoFirstPageHandler() {
      this.currentPage = 1
      this.load()
    }
  },

  computed: {
    hasNext() {
      return (this.currentPage * this.pageSize < this.total)
    },
    hasPrev() {
      return this.currentPage > 1
    },
    from() {
      return ((this.currentPage - 1) * this.pageSize) + 1
    },
    to() {
      return (this.from + this.tableProps.data.length) - 1
    }
  }
}
</script>

<style lang="less">
  @import "index.less";
</style>
