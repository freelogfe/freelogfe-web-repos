import { mapGetters } from 'vuex'
import { logout } from '@freelog/freelog-ui-login'

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
  },
  methods: {
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
      logout().then(() => {
        this.$store.dispatch('userLogout')
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
