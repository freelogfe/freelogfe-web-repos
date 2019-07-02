import TableView from '@/components/TableView/index.vue'
import ClipBoard from '@/components/clipboard/index.vue'
import { NODE_STATUS } from '@/config/node'
import { mapGetters } from 'vuex'

export default {
  name: 'my-nodes',
  data() {
    return {
      resourceList: [],
      NODE_STATUS
    }
  },
  components: {
    TableView,
    ClipBoard
  },
  computed: mapGetters({
    session: 'session'
  }),
  mounted() {
  },
  methods: {
    resolveDomain(row) {
      const post = /\.test/.test(window.location.host) ? '.testfreelog.com' : '.freelog.com'

      return `${window.location.protocol}//${row.nodeDomain}${post}`
    },
    loader() {
      const self = this
      return () => this.$services.nodes.get({
        params: {
          ownerUserId: self.session.user.userId
        }
      })
    },
    copyDoneHandler() {
      this.$message.success(this.$t('node.detailView.copySuccess'))
    },
    handleEdit(nodeDetail) {
      this.$router.push({ path: `/node/${nodeDetail.nodeId}` })
    },
    gotoNodeHandler(nodeDetail) {
      this.$store.dispatch('changeNode', nodeDetail)
        .then(() => {
          this.$router.push({ path: `/node/${nodeDetail.nodeId}` })
        })
    }
  }
}
