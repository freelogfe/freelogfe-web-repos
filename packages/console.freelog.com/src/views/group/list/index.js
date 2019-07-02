import TableView from '@/components/TableView/index.vue'
import * as GroupApi from '../../../services/groups'
import { GROUP_TYPES } from '../../../config/group'

export default {
  name: 'group-list',
  data() {
    return {}
  },
  components: {
    TableView
  },
  mounted() {
  },
  methods: {
    loader() {
      return () => GroupApi.list()
    },
    groupDetailHandler(row) {
      this.$router.push({ path: `/group/detail/${row.groupId}` })
    },
    resolveGroupType(row) {
      for (let i = 0; i < GROUP_TYPES.length; i += 1) {
        if (GROUP_TYPES[i].value === row.groupType) {
          return GROUP_TYPES[i].label
        }
      }

      return ''
    }
  }
}
