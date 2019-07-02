import {NODE_STATUS} from '@/config/node'
import ClipBoard from '@/components/clipboard/index.vue'
import {mapGetters} from 'vuex'
import NodePresentables from '../presentables-V4/index.vue'

export default {
  name: 'node-detail',
  data() {
    return {
      detail: {},
      domainSuffix: /\.testfreelog\.com$/.test(window.location.host) ? '.testfreelog.com' : '.freelog.com'
    }
  },
  components: {
    ClipBoard,
    NodePresentables,
    // NodePreview
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch('loadNodes')
        .then((nodes) => {
          const isValid = nodes.some(node => node.nodeId.toString() === vm.$route.params.nodeId)

          if (!isValid) {
            vm.$router.push('/')
          }
        })
    })
  },
  computed: {
    ...mapGetters({
      nodes: 'nodes'
    }),
  },
  mounted() {
    const nodeId = this.$route.params.nodeId

    if (nodeId) {
      this.init(nodeId)
    } else {
      this.$message.error(this.$t('node.detailView.paramError'))
    }
  },
  methods: {
    init(nodeId) {
      this.loadNodeDetail(nodeId).catch(this.$error.showErrorMessage)
    },
    loadNodeDetail(nodeId) {
      return this.$store.dispatch('loadNodeDetail', nodeId)
        .then(detail => {

          this.detail = detail
          detail.statusInfo = NODE_STATUS[detail.status]
        })
    },
    copyDoneHandler() {
      this.$message.success(this.$t('node.detailView.copySuccess'))
    },
    resolveDomain(node) {
      return `${window.location.protocol}//${node.nodeDomain}${this.domainSuffix}`
    }
  }
}
