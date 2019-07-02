export default {
  name: 'fl-breadcrumb',

  data() {
    return {
      breadcrumbs: []
    }
  },
  watch: {
    $route: 'breadcrumbHandler'
  },
  created() {
    this.breadcrumbHandler()
  },
  methods: {
    paddingTitle(title) {
      const params = this.$route.params
      const keys = Object.keys(params)
      keys.forEach((k) => {
        title = title.replace(`:${k}`, params[k])
      })

      return title
    },
    breadcrumbHandler() {
      const matched = this.$route.matched
      this.breadcrumbs = []
      if (this.$route.name === '404') {
        this.breadcrumbs = []
      } else {
        this.breadcrumbs = matched.map((m) => {
          const title = m.meta.title || ''

          return {
            path: m.path,
            title: this.paddingTitle(title)
          }
        }).filter(item => !!item.title)
      }
    }
  }
}
