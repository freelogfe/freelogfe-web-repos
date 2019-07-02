<template>
  <div>
    <el-autocomplete
      class="search-input"
      v-model="queryInput"
      :fetch-suggestions="querySearchAsync"
      :placeholder="$t('components.policyEditor.licensePlaceholder')"
      @select="handleSelect">
      <i class="el-icon-search el-input__icon" slot="prefix"></i>
      <clip-board
        slot="append"
        style="display: inline-block;margin-left: -8px;"
        @copyDone="copyDoneHandler"
        :value="selectedLicenseId">
        <el-button type="primary" plain :disabled="!selectedLicenseId"><i class="el-icon-fa-clipboard"></i></el-button>
      </clip-board>
    </el-autocomplete>
    <pre class="license-content">
      {{licenseContent}}
    </pre>
  </div>
</template>

<script>
import ClipBoard from '@/components/clipboard/index.vue'

export default {
  name: 'query-policy-license',

  data() {
    return {
      licenses: [],
      queryInput: '',
      licenseContent: '',
      selectedLicenseId: '',
      licenseMap: {}
    }
  },

  components: {
    ClipBoard
  },
  props: {
    callback: {
      type: Function
    }
  },

  mounted() {
    this.licenses = this.loadAll()
  },
  methods: {
    copyDoneHandler() {
      if (!this.selectedLicenseId) {
        return
      }
      this.$message.success(this.$t('components.policyEditor.copyDone'))
      if (typeof this.callback === 'function') {
        this.callback({
          name: 'selectLicenseId',
          data: {
            licenseId: this.selectedLicenseId
          }
        })
      }
    },
    loadAll() {
      this.$axios.get('/v1/resources/warehouse?resourceType=license').then((res) => {
        this.licenses = res.data.data.dataList.map(data => ({
          value: data.resourceName,
          id: data.resourceId
        }))
      })
    },
    querySearchAsync(queryString, cb) {
      const licenses = this.licenses
      const results = queryString ? licenses.filter(this.createStateFilter(queryString)) : licenses
      cb(results)
    },
    createStateFilter(queryString) {
      const qs = queryString.toLowerCase()
      const reg = new RegExp(qs, 'i')
      return state => reg.test(state.value) || reg.test(state.id)
    },
    handleSelect(item) {
      this.selectedLicenseId = item.id
      this.showLicenseContent(item)
    },
    showLicenseContent(item) {
      const id = item.id
      if (this.licenseMap[id]) {
        this.licenseContent = this.licenseMap[id]
      } else {
        this.$axios.get(`/v1/auths/resource/${id}.data`).then((res) => {
          const content = res.getData()
          if (content) {
            this.licenseContent = res.getData()
            this.licenseMap[id] = this.licenseContent
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .search-input {
    width: 80%;
    margin-bottom: 10px;
  }

  .license-content {
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    padding: 6px;
    max-height: 400px;
  }
</style>
