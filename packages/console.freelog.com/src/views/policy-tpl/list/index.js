import TableView from '@/components/TableView/index.vue'
import * as utils from '../utils'

export default {
  name: 'policy-tpl-list',
  data() {
    return {
      type: this.$route.meta.type || 'resource'
    }
  },
  components: {
    TableView
  },

  computed: {
    getCreateLink() {
      return `/${this.type}/policy_tpl/create`
    }
  },
  mounted() {
  },
  methods: {
    loader() {
      return (param) => {
        if (typeof param === 'object') {
          param.templateType = (this.type === 'node') ? 2 : 1
          param = {
            params: param
          }
        }
        return this.$services.policyTemplate.get(param || {})
      }
    },
    resolveType(type) {
      return utils.resolveType(type)
    },
    resolveStatus(status) {
      return utils.resolveStatus(status)
    },
    handleEdit(row) {
      this.$router.push({ path: `/${this.type}/policy_tpl/detail`, query: { id: row.id } })
    }
  }
}
