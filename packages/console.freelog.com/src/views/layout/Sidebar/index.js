import { mapGetters } from 'vuex'

export default {
  name: 'fl-sidebar',
  data() {
    return {
      isMini: true,
      isShowSidebar: true
    }
  },
  computed: {
    ...mapGetters({
      nodes: 'nodes'
    }),
    targetHostname() {
      return window.location.hostname.replace(/^console/, 'www')
    },
  },

  methods: {
    showMiniSidebar() {
      this.isMini= true
    },

  },
  watch: {
    '$route.fullPath'() {
      const { meta: { hideSidebar } } = this.$route
      this.isShowSidebar = !hideSidebar
    }
  },
  created() {

  },
  mounted() {
    const { meta: { hideSidebar } } = this.$route
    this.isShowSidebar = !hideSidebar
    document.addEventListener('click', this.showMiniSidebar)
  }
}
