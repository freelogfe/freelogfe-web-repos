import TableView from '@/components/TableView/index.vue'
import * as utils from '@/views/policy-tpl/utils'

export default {
  name: 'policy-tpl-select-list',
  data() {
    return {}
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    filter: {
      type: Function
    }
  },

  components: {
    TableView
  },

  computed: {
    tplList() {
      return (this.filter) ? this.filter(this.list) : this.list
    }
  },

  mounted() {
  },
  methods: {
    resolveType(type) {
      return utils.resolveType(type)
    },
    resolveStatus(status) {
      return utils.resolveStatus(status)
    },
    handleSelect(row) {
      this.$emit('select', { ...row })
    }
  }
}
