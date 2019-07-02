import SearchInput from '@/components/SearchInput/index.vue'
import ReleaseItemsList from './list.vue'

export default {
  name: 'release-list',
  data() {
    return {
      resourceList: [],
      curTabName: 'self',
      selfQueryInput: '',
      favorQueryInput: ''
    }
  },
  components: {
    ReleaseItemsList,
    SearchInput
  },

  methods: {
    searchHandler(query) {
      this.$message.warning('todo')
    }
  },

  mounted() {
  },
}
