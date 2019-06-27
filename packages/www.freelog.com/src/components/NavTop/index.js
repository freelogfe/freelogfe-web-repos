import { mapGetters } from 'vuex'

export default {
  name: 'nav-top-bar',
  data() {
    return {}
  },
  computed: mapGetters({
    userInfo: 'session'
  }),
  mounted() {
    this.syncUserSession()
    this.listenWindowVisibility()
  },
  methods: {
    listenWindowVisibility() {
      let hidden = 'hidden'
      const doc = document
      const self = this

      function onchange(evt) {
        const v = 'visible'
        const h = 'hidden'
        const evtMap = {
          focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
        }
        let type

        evt = evt || window.event
        if (evt.type in evtMap) {
          type = evtMap[evt.type]
        } else {
          type = this[hidden] ? 'hidden' : 'visible'
        }

        if (type === 'visible') {
          self.syncUserSession()
        }
      }

      if (hidden in doc) {
        doc.addEventListener('visibilitychange', onchange)
      } else if ('mozHidden' in doc) {
        hidden = 'mozHidden'
        doc.addEventListener('mozvisibilitychange', onchange)
      } else if ('webkitHidden' in doc) {
        hidden = 'webkitHidden'
        doc.addEventListener('webkitvisibilitychange', onchange)
      } else if ('msHidden' in doc) {
        hidden = 'msHidden'
        doc.addEventListener('msvisibilitychange', onchange)
      } else {
        window.onpageshow = onchange
        window.onpagehide = onchange
        window.onfocus = onchange
        window.onblur = onchange
      }
    },
    syncUserSession() {
      this.$store.dispatch('checkUserSession')
        .then((valid) => {
          if (!valid && this.userInfo && this.userInfo.userId) {
            this.$store.dispatch('loadCurrentUserInfo').then(() => {
              window.location.reload()
            })
          }
        })
    },
    logoutHandler() {
      this.$axios.get('/v1/passport/logout').then(() => {
        this.$store.dispatch('userLogout').then(() => {
          setTimeout(() => {
            const redirect = encodeURIComponent(window.location.href)
            window.location.replace(`//www.${window.FreelogApp.Env.mainDomain}/login?redirect=${redirect}`)
          }, 20)
        })
      })
    },
    handleNavTopCommand(command) {
      switch (command) {
        case 'gotoAccountSetting':
          window.location.href = '/profile'
          break
        default:
          break
      }
    }
  }
}
