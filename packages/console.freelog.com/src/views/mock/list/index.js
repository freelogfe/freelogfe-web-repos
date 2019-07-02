import SearchInput from '@/components/SearchInput/index.vue'
import CONFIG from '@/config/index'
import ResourceItems from './list.vue'

const { RESOURCE_STATUS } = CONFIG

export default {
  name: 'resource-list',
  data() {
    return {
      resourceList: [],
      curTabName: 'self',
      RESOURCE_STATUS,
      selfQueryInput: '',
      favorQueryInput: ''
    }
  },
  components: {
    ResourceItems,
    SearchInput
  },

  mounted() {
  },
  methods: {
    handleEdit(resource) {
      this.$router.push({ path: `/resource/edit/${resource.resourceId}` })
    },
    editAuthNode(resource) {
      this.$router.push({ path: `/resource/edit/${resource.resourceId}/auth_schemes` })
    },
    searchHandler(query) {
      console.log(query)
      // if (this.curTabName === 'self') {
      //   this.selfQueryInput = query
      // } else {
      //   this.favorQueryInput = query
      // }
      this.$message.warning('todo')
    }
  }
}
