import { mapGetters } from 'vuex'
import CropImage from '@/components/CropImage/index.vue'

export default {
  name: 'user-aside-nav',
  components: { CropImage },
  data() {
    return {
      activeNavName: 'my-profile',
      navs: [
        {
          name: 'my-accounts',
          link: 'accounts'
        },
        {
          name: 'my-contracts',
          link: 'contracts'
        },
        {
          name: 'my-profile',
          link: 'profile'
        }
      ],
      showImageCropUploader: false,
      avatarCls: '',
      avatarUrl: ''
    }
  },

  computed: {
    ...mapGetters({
      session: 'session',
      user: 'session'
    })
  },

  watch: {
    $route() {
      this.resolveCurrentNav()
    },
    'session.avatarUrl': function avatarUrl() {
      if (this.session.avatarUrl) {
        this.avatarCls = ''
        this.avatarUrl = this.session.avatarUrl
      }
    },
  },

  mounted() {
    if (!this.user || !this.user.userId) {
      this.$store.dispatch('getCurrentUserInfo').then(() => {

      })
    }
    this.resolveCurrentNav()
  },
  methods: {
    resolveCurrentNav() {
      const curPath = this.$route.fullPath
      for (let i = 0; i < this.navs.length; i += 1) {
        const nav = this.navs[i]
        if (curPath.indexOf(nav.link) > -1) {
          this.activeNavName = nav.name
          break
        }
      }
    },
    switchNavHandler(navItem) {
      this.activeNavName = navItem.name
      this.changePanel()
    },
    changePanel() {
      let curNav
      for (let i = 0; i < this.navs.length; i += 1) {
        const nav = this.navs[i]
        if (nav.name === this.activeNavName) {
          curNav = nav
          break
        }
      }

      if (curNav) {
        this.$router.push(`/user/${curNav.link}`)
      }
    },
    gotoMyProfile() {
      this.activeNavName = 'my-profile'
      this.changePanel()
    },
    imgErrorHandler() {
      this.avatarCls = 'not-found-img'
      this.$store.dispatch('changeAvatar', '')
    },
    uploadSuccessHandler() {
      this.$store.dispatch('changeAvatar')
      this.showImageCropUploader = false
    },
  }
}
